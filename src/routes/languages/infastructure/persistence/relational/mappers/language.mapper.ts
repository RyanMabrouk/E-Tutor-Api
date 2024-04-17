import { omit } from 'lodash';
import { LanguageEntity } from '../entities/language.entity';
import { Language } from 'src/routes/languages/domain/language';
import { GeneralDomainKeysArray } from 'src/shared/domain/general.domain';

export class LanguageMapper {
  static toDomain(raw: LanguageEntity): Language {
    const lang = new Language();
    delete raw.__entity;
    Object.assign(lang, raw);
    return omit(lang, GeneralDomainKeysArray) as Language;
  }

  static toPersistence(entity: Language): LanguageEntity {
    const langEntity = new LanguageEntity();
    Object.assign(langEntity, entity);
    return langEntity;
  }
}
