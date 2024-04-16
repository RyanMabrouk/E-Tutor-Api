import {
  IsString,
  IsNotEmpty,
  Validate,
  ValidatorConstraintInterface,
  ValidatorConstraint,
} from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Subcategory } from '../domain/subcategory';
import { Category } from 'src/routes/categories/domain/category';
@ValidatorConstraint({ name: 'IsCategoryConstraint', async: false })
export class IsCategoryConstraint implements ValidatorConstraintInterface {
  validate(category: any) {
    return category && typeof category.id === 'number';
  }
  defaultMessage() {
    return 'Each category must be an object with a numeric id';
  }
}
export class CreateSubcategoryDto
  implements Omit<Subcategory, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @Validate(IsCategoryConstraint)
  category: Category;
}
