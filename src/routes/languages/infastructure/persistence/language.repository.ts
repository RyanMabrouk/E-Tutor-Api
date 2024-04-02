import { Language } from '../../domain/language';
import {
  FilterLanguageDto,
  SortLanguageDto,
} from '../../dto/query-language.dto';
import { GeneralRepositoryType } from 'src/shared/repositories/general.repository.type';

export abstract class LanguageRepository extends GeneralRepositoryType<
  Language,
  FilterLanguageDto,
  SortLanguageDto,
  Language['id']
> {}
