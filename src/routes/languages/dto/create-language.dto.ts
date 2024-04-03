import { IsString, IsNotEmpty } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Language } from '../domain/language';

export class CreateLanguageDto
  implements Omit<Language, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;
}
