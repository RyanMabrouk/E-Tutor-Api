import { Course } from 'src/routes/courses/domain/course';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ReviewRepository } from '../../review.repository';
import { ReviewEntity } from '../entities/review.entity';
import { ReviewMapper } from '../mappers/review.mapper';
import { Review } from 'src/routes/reviews/domain/review';
import {
  FilterReviewDto,
  SortReviewDto,
} from 'src/routes/reviews/dto/query-review.dto';
import { ReviewsWithRatingCount } from 'src/routes/reviews/types/types';

@Injectable()
export class ReviewRelationalRepository implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(data: Review): Promise<Review> {
    const persistenceModel = ReviewMapper.toPersistence(data);
    const newEntity = await this.reviewRepository.save(
      this.reviewRepository.create(persistenceModel),
    );
    return ReviewMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
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
    const tableName =
      this.reviewRepository.manager.connection.getMetadata(
        ReviewEntity,
      ).tableName;

    const entities = await this.reviewRepository
      .createQueryBuilder(tableName)
      .leftJoinAndSelect(`${tableName}.course`, 'course')
      .leftJoinAndSelect(`${tableName}.user`, 'user')
      .where(`course.id = :courseId`, { courseId })
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .andWhere(filterOptions ?? {})
      .orderBy(
        sortOptions?.reduce(
          (accumulator, sort) => ({
            ...accumulator,
            [`${tableName}.${sort.orderBy}`]: sort.order,
          }),
          {},
        ) ?? {},
      )
      .getMany();

    const ratingCounts = await this.reviewRepository
      .createQueryBuilder(tableName)
      .select(`${tableName}.rating , COUNT(*) as count`)
      .leftJoin(`${tableName}.course`, 'course')
      .where(`course.id = :courseId`, { courseId })
      .groupBy(`${tableName}.rating`)
      .getRawMany();

    return {
      reviews: entities.map((e) => ReviewMapper.toDomain(e)),
      ratings: ratingCounts,
    };
  }

  async findOne(fields: EntityCondition<Review>): Promise<Review> {
    const entity = await this.reviewRepository.findOne({
      where: fields as FindOptionsWhere<ReviewEntity>,
    });
    if (!entity) {
      throw new BadRequestException('Review not found');
    }
    return ReviewMapper.toDomain(entity);
  }

  async update(id: Review['id'], payload: Partial<Review>): Promise<Review> {
    const domain = await this.findOne({ id: Number(id) });
    const updatedEntity = await this.reviewRepository.save(
      this.reviewRepository.create(
        ReviewMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );
    return ReviewMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Review['id']): Promise<void> {
    await this.reviewRepository.softDelete(id);
  }
}
