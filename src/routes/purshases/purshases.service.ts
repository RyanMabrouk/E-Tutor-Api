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

@Injectable()
export class PurshasesService {
  private stripe: Stripe;

  constructor(
    private readonly purshaseRepository: PurshaseRepository,
    private readonly coursesService: CourseService,
    private readonly usersService: UsersService,
    private readonly couponsService: CouponsService,
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
    if (!intent) {
      throw new BadRequestException('Payment failed');
    }
    user.courses.push(...courses);
    const userId = user.id as string | number;
    await this.usersService.update(userId, user as User);
    const incrementedCoupon = (coupon.numberOfUses += 1);

    await this.couponsService.update(coupon.id, {
      numberOfUses: incrementedCoupon,
    });
    const discount = courses.reduce((acc, course) => acc + course.discount, 0);
    const subTotal = courses.reduce((acc, course) => acc + course.price, 0);

    // const purshaseDto = {
    //   discount,
    //   user,
    //   courses,
    //   totalPrice: subTotal,
    // };
    const purshase = await this.purshaseRepository.create({
      discount,
      user,
      courses,
      totalPrice: subTotal,
    });

    return purshase;
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

  async findOne({ id }: { id: number }): Promise<Purshase | null> {
    return this.purshaseRepository.findOne({ id });
  }
}
