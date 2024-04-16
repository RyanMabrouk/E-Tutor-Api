import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { FilterCategoryDto, SortCategoryDto } from './dto/query-category.dto';

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
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne({ id });
  }

  //create
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: CreateCategoryDto,
  ) {
    return this.categoryService.update({ id }, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete({ id });
  }
}
