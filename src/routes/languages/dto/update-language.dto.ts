import { PartialType } from '@nestjs/swagger';
import { CreateLanguageDto } from './create-language.dto';
import { Exclude } from 'class-transformer';

export class UpdateLanguageDto extends PartialType(CreateLanguageDto) {
  @Exclude()
  name: string;
}
