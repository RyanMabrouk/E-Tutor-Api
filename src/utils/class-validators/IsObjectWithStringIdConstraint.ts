import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsObjectWithStringIdConstraint', async: false })
export class IsObjectWithStringIdConstraint
  implements ValidatorConstraintInterface
{
  validate(object: any) {
    return object && typeof object.id === 'string';
  }
  defaultMessage() {
    return `Property must be an object with a string id type`;
  }
}
