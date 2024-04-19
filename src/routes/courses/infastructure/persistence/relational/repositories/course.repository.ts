import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
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
    console.log(
      '🚀 ~ CourseRelationalRepository ~ create ~ persistenceModel:',
      persistenceModel,
    );
    const newEntity = await this.courseRepository.save(
      this.courseRepository.create(persistenceModel),
    );
    console.log(
      '🚀 ~ CourseRelationalRepository ~ create ~ newEntity:',
      newEntity,
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
      .leftJoinAndSelect(`${tableName}.category`, 'category')
      .leftJoinAndSelect(`${tableName}.subcategory`, 'subcategory')
      .leftJoinAndSelect(`${tableName}.language`, 'language')
      .leftJoinAndSelect(`${tableName}.subtitleLanguage`, 'subtitleLanguage')
      .leftJoinAndSelect(`${tableName}.thumbnail`, 'thumbnail')
      .leftJoinAndSelect(`${tableName}.trailer`, 'trailer')
      .leftJoinAndSelect(`${tableName}.instructors`, 'instructors')
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
    return entities.map(CourseMapper.toDomain);
  }

  async findOne(fields: EntityCondition<Course>): Promise<Course> {
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
    return CourseMapper.toDomain(entity);
  }

  async update(id: Course['id'], payload: Partial<Course>): Promise<Course> {
    const domain = await this.findOne({ id: id });
    const updatedEntity = await this.courseRepository.save(
      this.courseRepository.create(
        CourseMapper.toPersistence({
          ...domain,
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
