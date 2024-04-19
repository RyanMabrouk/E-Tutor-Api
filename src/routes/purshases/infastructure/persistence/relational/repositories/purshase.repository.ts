import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PurshaseRepository } from '../../purshase.repository';
import { PurshaseEntity } from '../entities/purshase';
import { PurshaseMapper } from '../mappers/purshase.mapper';
import { NullableType } from 'src/utils/types/nullable.type';
import { Purshase } from 'src/routes/purshases/domain/purshase';
import {
  FilterPurshaseDto,
  SortPurshaseDto,
} from 'src/routes/purshases/dto/query-purshase.dto';

@Injectable()
export class PurshaseRelationalRepository implements PurshaseRepository {
  constructor(
    @InjectRepository(PurshaseEntity)
    private readonly categoryRepository: Repository<PurshaseEntity>,
  ) {}

  async create(data: Purshase): Promise<Purshase> {
    const persistenceModel = PurshaseMapper.toPersistence(data);
    const newEntity = await this.categoryRepository.save(
      this.categoryRepository.create(persistenceModel),
    );
    return PurshaseMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterPurshaseDto | null;
    sortOptions?: SortPurshaseDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Purshase[]> {
    const tableName =
      this.categoryRepository.manager.connection.getMetadata(
        PurshaseEntity,
      ).tableName;
    const entities = await this.categoryRepository
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
    return entities.map((category) => PurshaseMapper.toDomain(category));
  }

  async findOne(
    fields: EntityCondition<Purshase>,
  ): Promise<NullableType<Purshase>> {
    const entity = await this.categoryRepository.findOne({
      where: fields as FindOptionsWhere<PurshaseEntity>,
    });

    if (!entity) {
      throw new BadRequestException('Category not found');
    }

    return entity ? PurshaseMapper.toDomain(entity) : null;
  }

  async update(
    id: Purshase['id'],
    payload: Partial<Purshase>,
  ): Promise<Purshase> {
    const entity = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new BadRequestException('Category not found');
    }

    const updatedEntity = await this.categoryRepository.save(
      this.categoryRepository.create(
        PurshaseMapper.toPersistence({
          ...PurshaseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PurshaseMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Purshase['id']): Promise<void> {
    await this.categoryRepository.softDelete(id);
  }
}
