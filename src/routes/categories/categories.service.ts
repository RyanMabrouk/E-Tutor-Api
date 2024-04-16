import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './infastructure/persistence/category.repository';
import { FilterCategoryDto, SortCategoryDto } from './dto/query-category.dto';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Category } from './domain/category';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }

  async findOne({ id }: { id: number }): Promise<Category | null> {
    return this.categoryRepository.findOne({ id });
  }

  async create(data: CreateCategoryDto): Promise<Category> {
    const category = await this.categoryRepository.create(data);
    console.log(category);
    return category;
  }

  async update(
    { id }: { id: number },
    data: UpdateCategoryDto,
  ): Promise<Category | null> {
    return this.categoryRepository.update(id, data);
  }

  async delete({ id }: { id: number }): Promise<void> {
    return this.categoryRepository.softDelete(id);
  }
}
