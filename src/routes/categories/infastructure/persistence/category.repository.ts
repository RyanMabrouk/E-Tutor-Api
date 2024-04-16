import { Category } from '../../domain/category';
import {
  FilterCategoryDto,
  SortCategoryDto,
} from '../../dto/query-category.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class CategoryRepository extends GeneralRepositoryType<
  Category,
  FilterCategoryDto,
  SortCategoryDto,
  Category['name']
> {}
