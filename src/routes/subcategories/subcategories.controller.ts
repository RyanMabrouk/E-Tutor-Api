import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../roles/roles.guard';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  FilterSubcategoryDto,
  SortSubcategoryDto,
} from './dto/query-subcategory.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { SubcategoryService } from './subcategories.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller({ path: 'subcategories', version: '1' })
@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly subcategoryService: SubcategoryService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Get()
  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterSubcategoryDto | null;
    sortOptions?: SortSubcategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }) {
    return this.subcategoryService.findAll({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
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
    @Body() updateCategoryDto: CreateSubcategoryDto,
  ) {
    return this.subcategoryService.update({ id }, updateCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoryService.delete({ id });
  }
}
