import { BadRequestException, Injectable } from '@nestjs/common';
import { PurshaseRepository } from './infastructure/persistence/purshase.repository';
import { FilterPurshaseDto, SortPurshaseDto } from './dto/query-purshase.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Purshase } from './domain/purshase';
import { CreatePurshaseDto } from './dto/create-purshase.dto';
import Stripe from 'stripe';
import { CourseService } from '../courses/course.service';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';
import { CouponsService } from '../coupons/coupons.service';
import { ConfirmPurshaseDto } from './dto/confirm-payement.dto';
import { Course } from '../courses/domain/course';
import { MailService } from 'src/shared/services/mail/mail.service';
import { RefundPurshaseDto } from './dto/request-refund.dto';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { GiftCoursesDto } from './dto/gift-courses.dto';
import { ConfirmGiftPurshaseDto } from './dto/confirm-gift-payement.dto';

@Injectable()
export class PurshasesService {
  private stripe: Stripe;

  constructor(
    private readonly purshaseRepository: PurshaseRepository,
    private readonly coursesService: CourseService,
    private readonly usersService: UsersService,
    private readonly couponsService: CouponsService,
    private readonly mailService: MailService,
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY as string;
    this.stripe = new Stripe(stripeSecret, {
      apiVersion: '2024-04-10',
    });
  }
  async checkout(cart: CreatePurshaseDto) {
    const coursesIds = cart.courses;
    const courses = await Promise.all(
      coursesIds.map(async (course) => {
        return await this.coursesService.findOne({ id: course.id });
      }),
    );
    const subTotal = courses.reduce((acc, course) => acc + course.price, 0);
    const discount = courses.reduce((acc, course) => acc + course.discount, 0);
    const coupon = await this.couponsService.findOne({ code: cart.couponCode });
    const total = subTotal - discount - (coupon ? coupon.value : 0);

    return this.stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        courses: JSON.stringify(coursesIds),
        coupon: coupon ? coupon.code : null,
      },
    });
  }
  async create(
    createPurshaseDto: CreatePurshaseDto,
    userPayload: JwtPayloadType,
  ) {
    const user = (await this.usersService.findOne({ id: userPayload.id }, [
      'courses',
    ])) as User;
    const coupon = await this.couponsService.findOne({
      code: createPurshaseDto.couponCode,
    });
    const isCouponExpired = coupon && coupon.expiryDate < new Date();
    if (isCouponExpired) {
      throw new BadRequestException('Coupon expired');
    }

    const coursesIds = createPurshaseDto.courses;
    if (
      user &&
      user.courses.some((userCourse) => {
        return coursesIds.some((dtoCourse) => userCourse.id === dtoCourse.id);
      })
    ) {
      throw new BadRequestException('Course already purchased');
    }
    const courses = await Promise.all(
      coursesIds.map(async (course) => {
        return await this.coursesService.findOne({ id: course.id });
      }),
    );
    console.log(courses);

    const intent = await this.checkout(createPurshaseDto);
    console.log(intent);
    if (!intent) {
      throw new BadRequestException('Payment failed');
    }
    const incremetedNumOfUses = coupon.numberOfUses + 1;
    await this.couponsService.update(coupon.id, {
      numberOfUses: incremetedNumOfUses,
    });
    return intent;
  }

  async confirmPayement(
    confirmPurshaseDto: ConfirmPurshaseDto,
    userId: JwtPayloadType['id'],
  ) {
    const user = (await this.usersService.findOne({ id: userId }, [
      'courses',
    ])) as User;
    const { paymentIntentId, card } = confirmPurshaseDto;
    console.log(paymentIntentId, card.paymentMethod.id);

    const payment = await this.stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: card.paymentMethod.id,
    });

    if (payment.status !== 'succeeded') {
      throw new BadRequestException('Payment failed');
    }
    const { courses: coursesIds, coupon } = payment.metadata;
    const parsedCoursesIds = JSON.parse(coursesIds) as { id: Course['id'] }[];

    const courses = await Promise.all(
      parsedCoursesIds.map(async (courseId) => {
        return await this.coursesService.findOne({ id: courseId.id });
      }),
    );

    await this.mailService.confirmPayment({
      to: user.email as string,
      data: {
        purchaseDetails: {
          user,
          courses,
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          discount:
            courses.reduce((acc, course) => acc + course.price, 0) -
            payment.amount / 100,
          totalPrice: payment.amount / 100,
        },
      },
    });

    const purshase = await this.purshaseRepository.create({
      user,
      courses,
      totalPrice: payment.amount / 100,
      couponCode: coupon,
      discount:
        courses.reduce((acc, course) => acc + course.price, 0) -
        payment.amount / 100,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentIntentId: payment.id,
    });

    user.courses.push(...courses);
    await this.usersService.update(user.id, user);

    return purshase;
  }

  async giftCourses(giftCoursesDto: GiftCoursesDto) {
    const user = (await this.usersService.findOne(
      { id: giftCoursesDto.recieverId },
      ['courses'],
    )) as User;
    const coupon = await this.couponsService.findOne({
      code: giftCoursesDto.couponCode,
    });
    const isCouponExpired = coupon && coupon.expiryDate < new Date();
    if (isCouponExpired) {
      throw new BadRequestException('Coupon expired');
    }

    const coursesIds = giftCoursesDto.courses;
    if (
      user &&
      user.courses.some((userCourse) => {
        return coursesIds.some((dtoCourse) => userCourse.id === dtoCourse.id);
      })
    ) {
      throw new BadRequestException('Course already purchased');
    }
    const courses = await Promise.all(
      coursesIds.map(async (course) => {
        return await this.coursesService.findOne({ id: course.id });
      }),
    );
    console.log(courses);

    const intent = await this.checkout(giftCoursesDto);
    if (!intent) {
      throw new BadRequestException('Payment failed');
    }
    return intent;
  }

  async confirmGiftPayment(confirmGiftPurshaseDto: ConfirmGiftPurshaseDto) {
    const user = await this.usersService.findOne({
      id: confirmGiftPurshaseDto.recieverId,
    });
    const purshase = await this.confirmPayement(
      confirmGiftPurshaseDto,
      user?.id as number,
    );

    return purshase;
  }

  async createRefund(refundPurshaseDto: RefundPurshaseDto) {
    const purshase = await this.purshaseRepository.findOne({
      paymentIntentId: refundPurshaseDto.paymentIntentId,
    });
    console.log(purshase);
    if (!purshase) {
      throw new BadRequestException('Purshase not found');
    }
    return this.stripe.refunds.create({
      payment_intent: purshase.paymentIntentId,
    });
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPurshaseDto | null;
    sortOptions?: SortPurshaseDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Purshase[]> {
    return this.purshaseRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne({
    field,
  }: {
    field: EntityCondition<Purshase>;
  }): Promise<Purshase | null> {
    console.log(field);
    return this.purshaseRepository.findOne(field);
  }

  async delete({ id }: { id: Purshase['id'] }): Promise<void> {
    await this.purshaseRepository.softDelete(id);
  }
}
