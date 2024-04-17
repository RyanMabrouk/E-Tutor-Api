import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NullableType } from 'src/utils/types/nullable.type';
import { CourseEntity } from '../entities/course.entity';
import { CourseMapper } from '../mappers/course.mapper';
import { Course } from 'src/routes/courses/domain/course';
import {
  FilterCourseDto,
  SortCourseDto,
} from 'src/routes/courses/dto/query-course.dto';
import { CourseRepository } from '../../course.repository';

@Injectable()
export class CourseRelationalRepository implements CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
  ) {}

  async create(data: Course): Promise<Course> {
    const persistenceModel = CourseMapper.toPersistence(data);
    const newEntity = await this.courseRepository.save(
      this.courseRepository.create(persistenceModel),
    );
    return CourseMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCourseDto | null;
    sortOptions?: SortCourseDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Course[]> {
    const tableName =
      this.courseRepository.manager.connection.getMetadata(
        CourseEntity,
      ).tableName;
    const entities = await this.courseRepository
      .createQueryBuilder(tableName)
      .skip((paginationOptions.page - 1) * paginationOptions.limit)
      .take(paginationOptions.limit)
      .where(filterOptions ?? {})
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
    return entities;
  }

  async findOne(
    fields: EntityCondition<Course>,
  ): Promise<NullableType<Course>> {
    const entity = await this.courseRepository.findOne({
      where: fields as FindOptionsWhere<CourseEntity>,
      relations: [
        'category',
        'subcategory',
        'language',
        'subtitleLanguage',
        'thumbnail',
        'trailer',
        'instructors',
      ],
    });
    if (!entity) {
      throw new BadRequestException('Course not found');
    }

    return entity ? CourseMapper.toDomain(entity) : null;
  }

  async update(id: Course['id'], payload: Partial<Course>): Promise<Course> {
    const entity = await this.courseRepository.findOne({
      where: { id: id },
    });

    if (!entity) {
      throw new BadRequestException('Course not found');
    }

    const updatedEntity = await this.courseRepository.save(
      this.courseRepository.create(
        CourseMapper.toPersistence({
          ...CourseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return CourseMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Course['id']): Promise<void> {
    await this.courseRepository.softDelete(id);
  }
}
