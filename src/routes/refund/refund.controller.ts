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
import { RefundsService } from './refund.service';
import { CreateRefundDto } from './dto/create-refund.dto';
import { QueryRefundDto } from './dto/query-refund.dto';
import { InfinityPaginationResultType } from '../../utils/types/infinity-pagination-result.type';
import { infinityPagination } from '../../utils/infinity-pagination';
import { Refund } from './domain/refund';
import { UpdateRefundDto } from './dto/update-refund.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('refunds')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'refunds', version: '1' })
export class RefundsController {
  constructor(private readonly refundService: RefundsService) {}

  @Get()
  async findAll(
    @Query() query: QueryRefundDto,
  ): Promise<InfinityPaginationResultType<Refund>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.refundService.findAll({
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.findOne({ id });
  }

  @Post()
  create(@Body() createRefundDto: CreateRefundDto) {
    return this.refundService.create(createRefundDto);
  }

  @Roles(RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRefundDto: UpdateRefundDto,
  ) {
    return this.refundService.update({ id }, updateRefundDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.refundService.delete({ id });
  }
}
