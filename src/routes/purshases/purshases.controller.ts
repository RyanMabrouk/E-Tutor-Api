import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { PurshasesService } from './purshases.service';
import { CreatePurshaseDto } from './dto/create-purshase.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from 'src/shared/decorators/user.decorator';
import { JwtPayloadType } from 'src/auth/strategies/types/jwt-payload.type';
import { ConfirmPurshaseDto } from './dto/confirm-payement.dto';
import { RefundPurshaseDto } from './dto/request-refund.dto';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { Purshase } from './domain/purshase';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { QueryPurshaseDto } from './dto/query-purshase.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { GiftCoursesDto } from './dto/gift-courses.dto';
import { ConfirmGiftPurshaseDto } from './dto/confirm-gift-payement.dto';

@ApiTags('purshases')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'purshase', version: '1' })
export class PurshasesController {
  constructor(private readonly purshasesService: PurshasesService) {}

  @Post()
  create(@Body() cart: CreatePurshaseDto, @User() user: JwtPayloadType) {
    return this.purshasesService.create(cart, user);
  }
  @Post('/confirm')
  confirmPayement(
    @Body() confirmPurshaseDto: ConfirmPurshaseDto,
    @User() user: JwtPayloadType,
  ) {
    return this.purshasesService.confirmPayement(confirmPurshaseDto, user.id);
  }
  @Post('/refund')
  refundPayement(@Body() refundPurshaseDto: RefundPurshaseDto) {
    return this.purshasesService.createRefund(refundPurshaseDto);
  }
  @Post('/gift')
  giftCourse(@Body() giftCoursesDto: GiftCoursesDto) {
    return this.purshasesService.giftCourses(giftCoursesDto);
  }
  @Post('/confirm-gift')
  confirmGift(@Body() confirmGiftPurshaseDto: ConfirmGiftPurshaseDto) {
    return this.purshasesService.confirmGiftPayment(confirmGiftPurshaseDto);
  }

  @Get()
  async findAll(
    @Query() query: QueryPurshaseDto,
  ): Promise<InfinityPaginationResultType<Purshase>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.purshasesService.findAll({
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
    return this.purshasesService.findOne({ field: { id } });
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.purshasesService.delete({ id });
  }
}
