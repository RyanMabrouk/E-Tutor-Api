import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-subcategory.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  FilterCategoryDto,
  SortCategoryDto,
} from './dto/query-subcategory.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'languages', version: '1' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoryService: CategoriesService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCategoryDto | null;
    sortOptions?: SortCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    return this.categoryService.findAll({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.categoryService.findOne({ name });
  }

  //create
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':name')
  update(
    @Param('name') name: string,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.update({ name }, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':name')
  delete(@Param('name') name: string) {
    return this.categoryService.delete({ name });
  }
}
