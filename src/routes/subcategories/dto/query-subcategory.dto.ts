import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Subcategory } from '../domain/subcategory';
import { SubcategoryEntity } from '../infastructure/persistence/relational/entities/subcategory.entity';

export type FilterSubcategoryDto = FindOptionsWhere<SubcategoryEntity>;

export class SortSubcategoryDto extends SortDto<Subcategory> {}

export class QuerySubcategoryDto extends QueryDto<
  Subcategory,
  FilterSubcategoryDto
> {}
