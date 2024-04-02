import { SortDto } from 'src/shared/dto/sort.dto';
import { QueryDto } from 'src/shared/dto/query.dto';
import { FindOptionsWhere } from 'typeorm';
import { LanguageEntity } from '../infastructure/persistence/relational/entities/language.entity';
import { Language } from '../domain/language';

export type FilterLanguageDto = FindOptionsWhere<LanguageEntity>;

export class SortLanguageDto extends SortDto<Language> {}

export class QueryLanguageDto extends QueryDto<Language, FilterLanguageDto> {}
