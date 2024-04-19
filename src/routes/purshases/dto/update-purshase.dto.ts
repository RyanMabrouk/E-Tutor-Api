import { PartialType } from '@nestjs/mapped-types';
import { CreatePurshaseDto } from './create-purshase.dto';

export class UpdatePurshaseDto extends PartialType(CreatePurshaseDto) {}
