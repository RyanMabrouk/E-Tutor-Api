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
import { QuerySubcategoryDto } from './dto/query-subcategory.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { SubcategoryService } from './subcategories.service';
import { successResponse } from 'src/auth/constants/response';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { Subcategory } from './domain/subcategory';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'subcategories', version: '1' })
@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  async findAll(
    @Query() query: QuerySubcategoryDto,
  ): Promise<InfinityPaginationResultType<Subcategory>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ? (query?.limit > 50 ? 50 : query?.limit) : 10;
    try {
      const data = infinityPagination(
        await this.subcategoryService.findAll({
          filterOptions: query?.filters ?? null,
          sortOptions: query?.sort ?? null,
          paginationOptions: {
            page,
            limit,
          },
          categoryId: query?.categoryId,
        }),
        { page, limit },
      );
      return data;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoryService.findOne({ id });
  }

  //create
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update({ id }, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.subcategoryService.delete({ id });
    return {
      ...successResponse,
    };
  }
}
