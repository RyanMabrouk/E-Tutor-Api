import { IsString, IsNotEmpty } from 'class-validator';
import { GeneralDomainKeys } from 'src/shared/domain/general.domain';
import { Category } from '../domain/category';

export class CreateCategoryDto implements Omit<Category, GeneralDomainKeys> {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;
}
