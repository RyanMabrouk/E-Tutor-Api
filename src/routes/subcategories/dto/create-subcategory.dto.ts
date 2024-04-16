import { IsString, IsNotEmpty } from 'class-validator';
import { GeneralDomainKeys } from 'src/shared/domain/general.domain';
import { Subcategory } from '../domain/subcategory';

export class CreateSubcategoryDto
  implements Omit<Subcategory, GeneralDomainKeys>
{
  @IsString()
  @IsNotEmpty()
  name: string;
}
