import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsObjectWithNumericIdConstraint', async: false })
export class IsObjectWithNumericIdConstraint
  implements ValidatorConstraintInterface
{
  validate(object: any) {
    return object && typeof object.id === 'number';
  }
  defaultMessage() {
    return 'Property must be an object with a numeric id';
  }
}
