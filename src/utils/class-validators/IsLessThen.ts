import {
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';
export function IsLessThan(
  property: number,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'isLessThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return typeof value === 'number' && value <= relatedPropertyName;
        },
        defaultMessage() {
          return `Property must be less than ${property}`;
        },
      },
    });
  };
}
