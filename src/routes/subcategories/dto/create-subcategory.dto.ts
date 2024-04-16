import { IsString, IsNotEmpty } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Subcategory } from '../domain/subcategory';

export class CreateSubcategoryDto
  implements Omit<Subcategory, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;
}
