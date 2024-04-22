import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Progress } from '../domain/progress';
import { IsNotEmpty, Validate, IsBoolean } from 'class-validator';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { User } from 'src/routes/users/domain/user';
export class CreateProgressDto
  implements Omit<Progress, GeneralDomainKeysWithId>
{
  @Validate(IsObjectWithNumericIdConstraint)
  lecture: Lecture;

  @Validate(IsObjectWithNumericIdConstraint)
  user: User;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
