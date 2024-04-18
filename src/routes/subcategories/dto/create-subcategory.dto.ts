import { IsString, IsNotEmpty, Validate } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Subcategory } from '../domain/subcategory';
import { Category } from 'src/routes/categories/domain/category';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';

export class CreateSubcategoryDto
  implements Omit<Subcategory, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @Validate(IsObjectWithNumericIdConstraint)
  category: Category;
}
