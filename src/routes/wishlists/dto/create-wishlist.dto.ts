import { IsArray, Validate } from 'class-validator';
import { Wishlist } from '../domain/wishlist';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Course } from 'src/routes/courses/domain/course';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';

export class CreateWishlistDto
  implements Omit<Wishlist, GeneralDomainKeysWithId | 'user'>
{
  @IsArray()
  @Validate(IsObjectWithNumericIdConstraint, { each: true })
  courses?: Course[];
}
