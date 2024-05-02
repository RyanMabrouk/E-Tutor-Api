import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { PurshaseRepository } from '../../purshase.repository';
import { PurshaseEntity } from '../entities/purshase.entity';
import { PurshaseMapper } from '../mappers/purshase.mapper';
import { Purshase } from 'src/routes/purshases/domain/purshase';
import {
  FilterPurshaseDto,
  SortPurshaseDto,
} from 'src/routes/purshases/dto/query-purshase.dto';

@Injectable()
export class PurshaseRelationalRepository implements PurshaseRepository {
  constructor(
    @InjectRepository(PurshaseEntity)
    private readonly purshaseRepository: Repository<PurshaseEntity>,
  ) {}

  async create(data: Purshase): Promise<Purshase> {
    const persistenceModel = PurshaseMapper.toPersistence(data);
    const newEntity = await this.purshaseRepository.save(
      this.purshaseRepository.create(persistenceModel),
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
      this.purshaseRepository.manager.connection.getMetadata(
        PurshaseEntity,
      ).tableName;
    const entities = await this.purshaseRepository
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
    return entities.map((purshase) => PurshaseMapper.toDomain(purshase));
  }

  async findOne(fields: EntityCondition<Purshase>): Promise<Purshase> {
    const entity = await this.purshaseRepository.findOne({
      where: fields as FindOptionsWhere<PurshaseEntity>,
    });
    if (!entity) {
      throw new BadRequestException('Purshase not found');
    }
    return PurshaseMapper.toDomain(entity);
  }

  async update(
    id: Purshase['id'],
    payload: Partial<Purshase>,
  ): Promise<Purshase> {
    const entity = await this.purshaseRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new BadRequestException('Purshase not found');
    }

    const updatedEntity = await this.purshaseRepository.save(
      this.purshaseRepository.create(
        PurshaseMapper.toPersistence({
          ...PurshaseMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return PurshaseMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Purshase['id']): Promise<void> {
    await this.purshaseRepository.softDelete(id);
  }
}
