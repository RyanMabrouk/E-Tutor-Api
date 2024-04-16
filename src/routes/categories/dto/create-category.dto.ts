import { IsString, IsNotEmpty } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Category } from '../domain/category';

export class CreateCategoryDto
  implements Omit<Category, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
