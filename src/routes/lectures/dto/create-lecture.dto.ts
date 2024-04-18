import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';
import { Lecture } from '../domain/lecture';
import { IsArray, IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsObjectWithNumericIdConstraint } from 'src/utils/class-validators/IsObjectWithNumericIdConstraint';
import { IsObjectWithStringIdConstraint } from 'src/utils/class-validators/IsObjectWithStringIdConstraint';
import { FileType } from 'src/routes/files/domain/file';
import { Section } from 'src/routes/sections/domain/section';
export class CreateLectureDto
  implements Omit<Lecture, GeneralDomainKeysWithId>
{
  @IsString()
  @IsNotEmpty()
  name: string;

  @Validate(IsObjectWithNumericIdConstraint)
  section: Section;

  @Validate(IsObjectWithStringIdConstraint)
  video: FileType;

  @Validate(IsObjectWithStringIdConstraint)
  attachement: FileType;

  @IsString()
  @IsNotEmpty()
  descripstion: string;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  captions: string[];
}
