import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityCondition } from 'src/utils/types/entity-condition.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { CouponEntity } from '../entities/coupon.entity';
import { CouponMapper } from '../mappers/coupon.mapper';

import { Coupon } from 'src/routes/coupons/domain/coupon';
import {
  FilterCouponDto,
  SortCouponDto,
} from 'src/routes/coupons/dto/query-coupon.dto';
import { CouponRepository } from '../../coupon.repository';

@Injectable()
export class CouponRelationalRepository implements CouponRepository {
  constructor(
    @InjectRepository(CouponEntity)
    private readonly couponRepository: Repository<CouponEntity>,
  ) {}

  async findOneOrNull(
    fields: EntityCondition<Coupon>,
    relations?: FindOneOptions<CouponEntity>['relations'],
  ): Promise<Coupon | null> {
    const entity = await this.couponRepository.findOne({
      where: fields as FindOptionsWhere<CouponEntity>,
      relations,
    });
    if (!entity) {
      return null;
    }
    return CouponMapper.toDomain(entity);
  }

  async create(data: Coupon): Promise<Coupon> {
    const persistenceModel = CouponMapper.toPersistence(data);
    const newEntity = await this.couponRepository.save(
      this.couponRepository.create(persistenceModel),
    );
    return CouponMapper.toDomain(newEntity);
  }

  async findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCouponDto | null;
    sortOptions?: SortCouponDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Coupon[]> {
    const tableName =
      this.couponRepository.manager.connection.getMetadata(
        CouponEntity,
      ).tableName;
    const entities = await this.couponRepository
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
    return entities.map((coupon) => CouponMapper.toDomain(coupon));
  }

  async findOne(fields: EntityCondition<Coupon>): Promise<Coupon> {
    const entity = await this.couponRepository.findOne({
      where: fields as FindOptionsWhere<CouponEntity>,
    });
    if (!entity) {
      throw new BadRequestException('Coupon not found');
    }
    return CouponMapper.toDomain(entity);
  }

  async update(id: Coupon['id'], payload: Partial<Coupon>): Promise<Coupon> {
    const domain = await this.findOne({ id });
    const updatedEntity = await this.couponRepository.save(
      this.couponRepository.create(
        CouponMapper.toPersistence({
          ...domain,
          ...payload,
        }),
      ),
    );

    return CouponMapper.toDomain(updatedEntity);
  }

  async softDelete(id: Coupon['id']): Promise<void> {
    await this.couponRepository.softDelete(id);
  }
}
