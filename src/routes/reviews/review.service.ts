import { CourseService } from './../courses/course.service';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { User } from '../users/domain/user';
import { ReviewRepository } from './infastructure/persistence/review.repository';
import { Review } from './domain/review';
import { CreateReviewDto } from './dto/create-review.dto';
import { FilterReviewDto, SortReviewDto } from './dto/query-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Course } from '../courses/domain/course';
import { filterObjectHelper } from 'src/shared/helpers/filterObjectHelper';
import { ReviewsWithRatingCount } from './types/types';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly courseService: CourseService,
  ) {}

  async create(
    createPayload: CreateReviewDto,
    userId: User['id'],
  ): Promise<Review> {
    await this.courseService.validateUserCompletedCourse({
      userId,
      courseId: createPayload.course.id,
    });
    try {
      const created = await this.reviewRepository.create({
        ...createPayload,
        user: { id: userId } as User,
      });
      return created;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
    courseId,
  }: {
    filterOptions?: FilterReviewDto | null;
    sortOptions?: SortReviewDto[] | null;
    paginationOptions: IPaginationOptions;
    courseId: Course['id'];
  }): Promise<ReviewsWithRatingCount> {
    return this.reviewRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
      courseId,
    });
  }

  async update(
    id: number,
    updatePayload: UpdateReviewDto,
    userId: User['id'],
  ): Promise<Review | null> {
    await this.validateUserCanEdit({ reviewId: id, userId });
    try {
      const updated = await this.reviewRepository.update(id, updatePayload);
      return updated;
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            id: 'Review doesnt exist',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async remove(id: number, userId: User['id']) {
    await this.validateUserCanEdit({ reviewId: id, userId });
    await this.reviewRepository.softDelete(id);
  }

  async validateUserCanEdit({
    userId,
    reviewId,
  }: {
    userId: User['id'];
    reviewId: Review['id'];
  }) {
    const review = await this.reviewRepository.findOne({ id: reviewId });
    if (review.user.id !== userId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You are not the owner of this review',
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  filterObjectHelper(review: Review) {
    return {
      ...filterObjectHelper<Review>({
        data: review,
        Omit: ['course'],
      }),
      user: filterObjectHelper<User>({
        data: review.user,
        Pick: ['id', 'firstName', 'lastName', 'username'],
      }),
    };
  }
}
