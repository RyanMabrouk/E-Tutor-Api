import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { Progress } from '../domain/progress';
import { ProgressEntity } from '../infastructure/persistence/relational/entities/progress.entity';

export type FilterProgressDto = FindOptionsWhere<ProgressEntity>;

export class SortProgressDto extends SortDto<Progress> {}

export class QueryProgressDto extends QueryDto<Progress, FilterProgressDto> {}
