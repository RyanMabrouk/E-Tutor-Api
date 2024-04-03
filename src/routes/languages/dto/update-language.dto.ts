import { PartialType } from '@nestjs/mapped-types';
import { CreateLanguageDto } from './create-language.dto';
import { Exclude } from 'class-transformer';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @Exclude()
  name: string;
}
