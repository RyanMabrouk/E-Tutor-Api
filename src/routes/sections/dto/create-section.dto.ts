import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Section } from '../domain/section';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { Course } from 'src/routes/courses/domain/course';
export class CreateSectionDto
  implements Omit<Section, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @Validate(IsObjectWithNumericIdConstraint)
  course: Course;
}
