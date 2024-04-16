import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './infastructure/persistence/category.repository';
import {
  FilterCategoryDto,
  SortCategoryDto,
} from './dto/query-subcategory.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Category } from './domain/subcategory';
import { CreateCategoryDto } from './dto/create-subcategory.dto';
import { UpdateCategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterCategoryDto | null;
    sortOptions?: SortCategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Category[]> {
    return this.categoryRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }

  async findOne({ name }: { name: string }): Promise<Category | null> {
    return this.categoryRepository.findOne({ name: name });
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(data);
  }

  async update(
    { name }: { name: string },
    data: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryRepository.update(name, data);
  }

  async delete({ name }: { name: string }): Promise<void> {
    return this.categoryRepository.softDelete(name);
  }
}
