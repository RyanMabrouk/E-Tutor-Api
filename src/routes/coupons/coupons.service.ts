import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponRepository } from './infastructure/persistence/coupon.repository';
import { FilterCouponDto, SortCouponDto } from './dto/query-coupon.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Coupon } from './domain/coupon';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly couponRepository: CouponRepository) {}

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCouponDto | null;
    sortOptions?: SortCouponDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Coupon[]> {
    return this.couponRepository.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne({ id }: { id: number }): Promise<Coupon> {
    return this.couponRepository.findOne({ id });
  }

  async create(data: CreateCouponDto): Promise<Coupon> {
    const isRepeatedCode = await this.couponRepository.findOneOrNull({
      code: data.code,
    });

    if (isRepeatedCode) {
      throw new BadRequestException('Coupon code already exists');
    }
    const coupon = await this.couponRepository.create(data);
    return coupon;
  }

  async update(
    { id }: { id: number },
    data: UpdateCouponDto,
  ): Promise<Coupon | null> {
    return this.couponRepository.update(id, data);
  }

  async delete({ id }: { id: number }): Promise<void> {
    return this.couponRepository.softDelete(id);
  }
}
