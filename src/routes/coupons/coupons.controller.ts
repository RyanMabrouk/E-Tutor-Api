import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CouponsService } from './coupons.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { QueryCouponDto } from './dto/query-coupon.dto';
import { InfinityPaginationResultType } from '../../utils/types/infinity-pagination-result.type';
import { infinityPagination } from '../../utils/infinity-pagination';
import { Coupon } from './domain/coupon';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('coupons')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'coupons', version: '1' })
export class CouponsController {
  constructor(private readonly couponService: CouponsService) {}

  @Get()
  async findAll(
    @Query() query: QueryCouponDto,
  ): Promise<InfinityPaginationResultType<Coupon>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.couponService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Get(':id')
  findOne(@Param('code') code: string) {
    return this.couponService.findOne({ code });
  }

  @Roles(RoleEnum.admin)
  @Post()
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Roles(RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(id, updateCouponDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.couponService.delete({ id });
  }
}
