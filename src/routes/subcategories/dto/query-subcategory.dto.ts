import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Subcategory } from '../domain/subcategory';
import { SubcategoryEntity } from '../infastructure/persistence/relational/entities/subcategory.entity';
import { Category } from 'src/routes/categories/domain/category';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export type FilterSubcategoryDto = FindOptionsWhere<SubcategoryEntity>;

export class SortSubcategoryDto extends SortDto<Subcategory> {}

export class QuerySubcategoryDto extends QueryDto<
  Subcategory,
  FilterSubcategoryDto
> {
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  categoryId?: Category['id'];
}
