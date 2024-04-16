import { Subcategory } from '../../domain/subcategory';
import {
  FilterSubcategoryDto,
  SortSubcategoryDto,
} from '../../dto/query-subcategory.dto';
import { GeneralRepositoryType } from '../../../../shared/repositories/general.repository.type';

export abstract class SubcategoryRepository extends GeneralRepositoryType<
  Subcategory,
  FilterSubcategoryDto,
  SortSubcategoryDto,
  Subcategory['name']
> {}
