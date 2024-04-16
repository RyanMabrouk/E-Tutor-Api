import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { CategoryEntity } from '../infastructure/persistence/relational/entities/category.entity';
import { Category } from '../domain/category';

export type FilterCategoryDto = FindOptionsWhere<CategoryEntity>;

export class SortCategoryDto extends SortDto<Category> {}

export class QueryCategoryDto extends QueryDto<Category, FilterCategoryDto> {}
