import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { SectionRepository } from '../../section.repository';
import { SectionEntity } from '../entities/section.entity';
import { SectionMapper } from '../mappers/section.mapper';
import { Section } from 'src/routes/sections/domain/section';
import {
  FilterSectionDto,
  SortSectionDto,
} from 'src/routes/sections/dto/query-section.dto';
import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
import { Course } from 'src/routes/courses/domain/course';

@Injectable()
export class SectionRelationalRepository implements SectionRepository {
  constructor(
    @InjectRepository(SectionEntity)
    private readonly sectionRepository: Repository<SectionEntity>,
  ) {}

  async create(data: Section): Promise<Section> {
    const persistenceModel = SectionMapper.toPersistence(data);
    const newEntity = await this.sectionRepository.save(
      this.sectionRepository.create(persistenceModel),
    );
    return SectionMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    courseId,
  }: {
    filterOptions?: FilterSectionDto | null;
    sortOptions?: SortSectionDto[] | null;
    paginationOptions: IPaginationOptions;
    courseId: Course['id'];
  }): Promise<Section[]> {
    const tableName =
      this.sectionRepository.manager.connection.getMetadata(
        SectionEntity,
      ).tableName;
    const CoursesTableName =
      this.sectionRepository.manager.connection.getMetadata(
        CourseEntity,
      ).tableName;
    const entities = await this.sectionRepository
      .createQueryBuilder(tableName)
      .innerJoinAndSelect(
        `${tableName}.course`,
        CoursesTableName,
        `${CoursesTableName}.id = :courseId`,
        { courseId },
      )
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

    return entities.map((section) => {
      if (section.hasOwnProperty('course')) {
        delete (section as { course?: unknown }).course;
      }
      return SectionMapper.toDomain(section);
    });
  }

  async findOne(
    fields: EntityCondition<Section>,
    relations?: FindOneOptions<SectionEntity>['relations'],
  ): Promise<Section> {
    const entity = await this.sectionRepository.findOne({
      where: fields as FindOptionsWhere<SectionEntity>,
      relations,
    });
    if (!entity) {
      throw new BadRequestException('Section not found');
    }
    return SectionMapper.toDomain(entity);
  }

  async update(id: Section['id'], payload: Partial<Section>): Promise<Section> {
    const domain = await this.findOne({ id });
    const updatedEntity = await this.sectionRepository.save(
      this.sectionRepository.create(
        SectionMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );
    return SectionMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Section['id']): Promise<void> {
    await this.sectionRepository.softDelete(id);
  }
}
