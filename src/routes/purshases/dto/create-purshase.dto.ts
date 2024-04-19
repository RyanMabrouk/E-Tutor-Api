import { IsString, IsNotEmpty } from 'class-validator';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Purshase } from '../domain/purshase';
import { Course } from 'src/routes/courses/domain/course';

export class CreatePurshaseDto
  implements Omit<Purshase, GeneralDomainKeysWithId>
{
  @IsNotEmpty()
  discount: number;

  @IsString()
  @IsNotEmpty()
  courses: Course[];
}
