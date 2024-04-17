import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUserConstraint', async: false })
export class IsUserConstraint implements ValidatorConstraintInterface {
  validate(object: any) {
    return (
      object && (typeof object.id === 'number' || typeof object.id === 'string')
    );
  }
  defaultMessage() {
    return `Property must be an object with a correct id type`;
  }
}
