import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Exclude } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Exclude()
  name: string;

  @Exclude()
  color: string;
}
