import { BadRequestException, Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  FilterSubcategoryDto,
  SortSubcategoryDto,
} from './dto/query-subcategory.dto';
import { Subcategory } from './domain/subcategory';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryRepository } from './infastructure/persistence/subcategories.repository';
import { Category } from '../categories/domain/category';
import { CategoryRepository } from '../categories/infastructure/persistence/category.repository';

@Injectable()
export class SubcategoryService {
  constructor(
    private readonly subcategoryRepository: SubcategoryRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
    categoryId,
  }: {
    filterOptions?: FilterSubcategoryDto | null;
    sortOptions?: SortSubcategoryDto[] | null;
    paginationOptions: IPaginationOptions;
    categoryId?: Category['id'];
  }): Promise<Subcategory[]> {
    return this.subcategoryRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
      categoryId,
    });
  }

  findOne({ id }: { id: number }): Promise<Subcategory | null> {
    return this.subcategoryRepository.findOne({ id: id });
  }

  async create(data: CreateSubcategoryDto): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({
      id: data.category.id,
    });
    if (!category) {
      throw new BadRequestException('Category not found');
    }
    return this.subcategoryRepository.create(data);
  }

  update(
    { id }: { id: number },
    data: UpdateSubcategoryDto,
  ): Promise<Subcategory | null> {
    return this.subcategoryRepository.update(id, data);
  }

  async delete({ id }: { id: number }): Promise<void> {
    return this.subcategoryRepository.softDelete(id);
  }
}
