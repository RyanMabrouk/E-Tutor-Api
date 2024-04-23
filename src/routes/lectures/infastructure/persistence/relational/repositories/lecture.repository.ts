import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { LectureEntity } from '../entities/lecture.entity';
import { LectureRepository } from '../../lecture.repository';
import {
  FilterLectureDto,
  SortLectureDto,
} from 'src/routes/lectures/dto/query-lecture.dto';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { LectureMapper } from '../mappers/lecture.mapper';
import { SectionEntity } from 'src/routes/sections/infastructure/persistence/relational/entities/section.entity';
import { Section } from 'src/routes/sections/domain/section';

@Injectable()
export class LectureRelationalRepository implements LectureRepository {
  constructor(
    @InjectRepository(LectureEntity)
    private readonly lectureRepository: Repository<LectureEntity>,
  ) {}

  async create(data: Lecture): Promise<Lecture> {
    const persistenceModel = LectureMapper.toPersistence(data);
    const newEntity = await this.lectureRepository.save(
      this.lectureRepository.create(persistenceModel),
    );
    return LectureMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    sectionId,
  }: {
    filterOptions?: FilterLectureDto | null;
    sortOptions?: SortLectureDto[] | null;
    paginationOptions: IPaginationOptions;
    sectionId: Section['id'];
  }): Promise<Lecture[]> {
    const tableName =
      this.lectureRepository.manager.connection.getMetadata(
        LectureEntity,
      ).tableName;
    const SectionsTableName =
      this.lectureRepository.manager.connection.getMetadata(
        SectionEntity,
      ).tableName;
    const entities = await this.lectureRepository
      .createQueryBuilder(tableName)
      .innerJoinAndSelect(
        `${tableName}.section`,
        SectionsTableName,
        `${SectionsTableName}.id = :sectionId`,
        { sectionId },
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

    return entities.map((lecture) => {
      if (lecture.hasOwnProperty('section')) {
        delete (lecture as { section?: unknown }).section;
      }
      return LectureMapper.toDomain(lecture);
    });
  }

  async findOne(
    fields: EntityCondition<Lecture>,
    relations?: FindOneOptions<SectionEntity>['relations'],
  ): Promise<Lecture> {
    const entity = await this.lectureRepository.findOne({
      where: fields as FindOptionsWhere<LectureEntity>,
      relations,
    });
    if (!entity) {
      throw new BadRequestException('Lecture not found');
    }

    return LectureMapper.toDomain(entity);
  }

  async update(id: Lecture['id'], payload: Partial<Lecture>): Promise<Lecture> {
    const domain = await this.findOne({ id });
    const updatedEntity = await this.lectureRepository.save(
      this.lectureRepository.create(
        LectureMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );
    return LectureMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Lecture['id']): Promise<void> {
    await this.lectureRepository.softDelete(id);
  }

  async getLectureCourseId(lectureId: Lecture['id']): Promise<number> {
    const tableName =
      this.lectureRepository.manager.connection.getMetadata(
        LectureEntity,
      ).tableName;
    const entity = await this.lectureRepository
      .createQueryBuilder(tableName)
      .leftJoinAndSelect(`${tableName}.section`, `section`)
      .leftJoinAndSelect(`section.course`, `course`)
      .where({ id: lectureId })
      .getOne();
    const courseId = entity?.section.course.id;
    if (!courseId) {
      throw new Error('Somthing went wrong');
    }
    return courseId;
  }
}
