import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOptionsWhere, Repository } from 'typeorm';
import { RefundEntity } from '../entities/refund.entity';
import { RefundMapper } from '../mappers/refund.mapper';
import { Refund } from 'src/routes/refund/domain/refund';
import {
  FilterRefundDto,
  SortRefundDto,
} from 'src/routes/refund/dto/query-refund.dto';

@Injectable()
export class RefundRelationalRepository implements RefundRelationalRepository {
  constructor(
    @InjectRepository(RefundEntity)
    private readonly refundRepository: Repository<RefundEntity>,
  ) {}

  async create(data: Refund): Promise<Refund> {
    const persistenceModel = RefundMapper.toPersistence(data);
    const newEntity = await this.refundRepository.save(
      this.refundRepository.create(persistenceModel),
    );
    return RefundMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterRefundDto | null;
    sortOptions?: SortRefundDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Refund[]> {
    const tableName =
      this.refundRepository.manager.connection.getMetadata(
        RefundEntity,
      ).tableName;
    const entities = await this.refundRepository
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
    return entities.map((refund) => RefundMapper.toDomain(refund));
  }

  async findOne(fields: EntityCondition<Refund>): Promise<Refund> {
    const entity = await this.refundRepository.findOne({
      where: fields as FindOptionsWhere<RefundEntity>,
    });
    if (!entity) {
      throw new BadRequestException('Refund not found');
    }
    return RefundMapper.toDomain(entity);
  }

  async update(id: Refund['id'], payload: Partial<Refund>): Promise<Refund> {
    const domain = await this.findOne({ id });
    const updatedEntity = await this.refundRepository.save(
      this.refundRepository.create(
        RefundMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );

    return RefundMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Refund['id']): Promise<void> {
    await this.refundRepository.softDelete(id);
  }
}
