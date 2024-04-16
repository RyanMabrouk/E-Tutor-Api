import { Subcategory } from '../../domain/subcategory';
import {
  FilterSubcategoryDto,
  SortSubcategoryDto,
} from '../../dto/query-subcategory.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';
import { IPaginationOptions } from 'src/utils/types/pagination-options';
import { Category } from 'src/routes/categories/domain/category';

export abstract class SubcategoryRepository extends GeneralRepositoryType<
  Subcategory,
  FilterSubcategoryDto,
  SortSubcategoryDto,
  Subcategory['id']
> {
  abstract findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
    categoryId,
  }: {
    filterOptions?: FilterSubcategoryDto | null;
    sortOptions?: SortSubcategoryDto[] | null;
    paginationOptions: IPaginationOptions;
    categoryId?: Category['id'];
  }): Promise<Subcategory[]>;
}
