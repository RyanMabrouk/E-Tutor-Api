import { Category } from 'src/routes/categories/domain/category';
import { GeneralDomain } from '../../../shared/domain/general.domain';

export class Subcategory extends GeneralDomain {
  id: number;
  name: string;
  category: Category;
}
