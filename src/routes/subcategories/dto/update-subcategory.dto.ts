import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { Exclude } from 'class-transformer';
import { Category } from 'src/routes/categories/domain/category';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @Exclude()
  category?: Category | undefined;
}
