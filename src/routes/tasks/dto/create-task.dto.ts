import {
  IsDateString,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  IsNumber,
  ArrayNotEmpty,
  Validate,
} from 'class-validator';
import { IsUserConstraint } from 'src/routes/projects/dto/create-project.dto';
import { ProjectEntity } from 'src/routes/projects/infastructure/persistence/relational/entities/project.entity';
import { User } from 'src/routes/users/domain/user';
import { Task } from '../domain/task';
import { Exclude } from 'class-transformer';
import { GeneralDomainKeysWithId } from 'src/shared/domain/general.domain';

export class CreateTaskDto implements Omit<Task, GeneralDomainKeysWithId> {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string | null = null;

  // gets the project id instead of the project entity
  @IsNumber()
  projectId: ProjectEntity['id'];
  @Exclude()
  project: ProjectEntity;

  @IsDateString()
  @IsOptional()
  due_date: Date | null = null;

  @IsArray()
  @ArrayNotEmpty()
  @Validate(IsUserConstraint, { each: true })
  members: User[];

  @IsBoolean()
  @IsOptional()
  completed: boolean = false;

  @IsDateString()
  @IsOptional()
  completedAt: Date | null = null;

  @IsDateString()
  @IsOptional()
  startedAt: Date | null = null;
}
