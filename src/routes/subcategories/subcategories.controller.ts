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
import { QuerySubcategoryDto } from './dto/query-subcategory.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { SubcategoryService } from './subcategories.service';
import { infinityPagination } from 'src/utils/infinity-pagination';
import { Subcategory } from './domain/subcategory';
import { InfinityPaginationResultType } from 'src/utils/types/infinity-pagination-result.type';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { RoleEnum } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'subcategories', version: '1' })
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

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

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoryService.findOne({ id });
  }

  //create
  @Roles(RoleEnum.admin)
  @Post()
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoryService.create(createSubcategoryDto);
  }

  @Roles(RoleEnum.admin)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoryService.update({ id }, updateCategoryDto);
  }

  @Roles(RoleEnum.admin)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.subcategoryService.delete({ id });
  }
}
