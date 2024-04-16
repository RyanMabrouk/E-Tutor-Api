import { SortDto } from '../../../shared/dto/sort.dto';
import { QueryDto } from '../../../shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { CategoryEntity } from '../infastructure/persistence/relational/entities/category.entity';
import { Category } from '../domain/category';

export type FilterCategoryDto = FindOptionsWhere<CategoryEntity>;

export class SortCategoryDto extends SortDto<Category> {}

export class QueryCategoryDto extends QueryDto<Category, FilterCategoryDto> {}
