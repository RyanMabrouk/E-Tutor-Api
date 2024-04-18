import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Section } from '../domain/section';
import { SectionEntity } from '../infastructure/persistence/relational/entities/section.entity';
import { IsNumber, IsPositive } from 'class-validator';
import { Transform } from 'class-transformer';

export type FilterSectionDto = FindOptionsWhere<SectionEntity>;

export class SortSectionDto extends SortDto<Section> {}

export class QuerySectionDto extends QueryDto<Section, FilterSectionDto> {
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsPositive()
  courseId: number;
}
