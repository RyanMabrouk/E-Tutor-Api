import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Lecture } from '../domain/lecture';
import { LectureEntity } from '../infastructure/persistence/relational/entities/lecture.entity';
import { Transform } from 'class-transformer';
import { IsNumber, IsPositive } from 'class-validator';

export type FilterLectureDto = FindOptionsWhere<LectureEntity>;

export class SortLectureDto extends SortDto<Lecture> {}

export class QueryLectureDto extends QueryDto<Lecture, FilterLectureDto> {
  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsPositive()
  sectionId: number;
}
