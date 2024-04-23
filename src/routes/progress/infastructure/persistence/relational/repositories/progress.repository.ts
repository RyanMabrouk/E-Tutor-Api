import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { ProgressRepository } from '../../section.repository';
import { ProgressEntity } from '../entities/progress.entity';
import { ProgressMapper } from '../mappers/progress.mapper';
// import { CourseEntity } from 'src/routes/courses/infastructure/persistence/relational/entities/course.entity';
// import { Course } from 'src/routes/courses/domain/course';
import { Progress } from 'src/routes/progress/domain/progress';
import {
  FilterProgressDto,
  SortProgressDto,
} from 'src/routes/progress/dto/query-progress.dto';

@Injectable()
export class ProgressRelationalRepository implements ProgressRepository {
  constructor(
    @InjectRepository(ProgressEntity)
    private readonly progressRepository: Repository<ProgressEntity>,
  ) {}

  async create(data: Progress): Promise<Progress> {
    const persistenceModel = ProgressMapper.toPersistence(data);
    const newEntity = await this.progressRepository.save(
      this.progressRepository.create(persistenceModel),
    );
    return ProgressMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterProgressDto | null;
    sortOptions?: SortProgressDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Progress[]> {
    const tableName =
      this.progressRepository.manager.connection.getMetadata(
        ProgressEntity,
      ).tableName;
    const entities = await this.progressRepository
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
    return entities.map((user) => ProgressMapper.toDomain(user));
  }

  async findOne(
    fields: EntityCondition<Progress>,
    relations?: FindOneOptions<ProgressEntity>['relations'],
  ): Promise<Progress> {
    const entity = await this.progressRepository.findOne({
      where: fields as FindOptionsWhere<ProgressEntity>,
      relations,
    });
    if (!entity) {
      throw new BadRequestException('Section not found');
    }
    return ProgressMapper.toDomain(entity);
  }

  async update(
    id: Progress['id'],
    payload: Partial<Progress>,
  ): Promise<Progress> {
    const domain = await this.findOne({ id });
    const updatedEntity = await this.progressRepository.save(
      this.progressRepository.create(
        ProgressMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );
    return ProgressMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Progress['id']): Promise<void> {
    await this.progressRepository.softDelete(id);
  }
}
