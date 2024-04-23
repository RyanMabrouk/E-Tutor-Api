import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { successResponse } from 'src/auth/constants/response';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { ProgressService } from './progress.service';
import { QueryProgressDto } from './dto/query-progress.dto';
import { Progress } from './domain/progress';
import { CreateProgressDto } from './dto/create-progress.dto';
import { UpdateProgressDto } from './dto/update-progress.dto';
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'progress', version: '1' })
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  async findAll(
    @Query() query: QueryProgressDto,
  ): Promise<InfinityPaginationResultType<Progress>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.progressService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          // courseId: query.courseId,
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
    return this.progressService.findOne({ id });
  }

  //create
  @Post()
  create(@Body() createProgressDto: CreateProgressDto) {
    console.log(createProgressDto);
    return this.progressService.create(createProgressDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProgressDto: UpdateProgressDto,
  ) {
    return this.progressService.update({ id }, updateProgressDto);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.progressService.delete({ id });
    return {
      ...successResponse,
    };
  }
}
