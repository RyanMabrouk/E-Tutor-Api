import { Injectable } from '@nestjs/common';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import {
  FilterSubcategoryDto,
  SortSubcategoryDto,
} from './dto/query-subcategory.dto';
import { Subcategory } from './domain/subcategory';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { SubcategoryRepository } from './infastructure/persistence/subcategories.repository';

@Injectable()
export class SubcategoryService {
  constructor(private readonly categoryRepository: SubcategoryRepository) {}

  findAll({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterSubcategoryDto | null;
    sortOptions?: SortSubcategoryDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Subcategory[]> {
    return this.categoryRepository.findManyWithPagination({
      filterOptions: { ...filterOptions },
      sortOptions,
      paginationOptions,
    });
  }

  findOne({ id }: { id: number }): Promise<Subcategory | null> {
    return this.categoryRepository.findOne({ id: id });
  }

  create(data: CreateSubcategoryDto): Promise<Subcategory> {
    return this.categoryRepository.create(data);
  }

  update(
    { id }: { id: number },
    data: UpdateSubcategoryDto,
  ): Promise<Subcategory | null> {
    return this.categoryRepository.update(id, data);
  }

  delete({ id }: { id: number }): Promise<void> {
    return this.categoryRepository.softDelete(id);
  }
}
