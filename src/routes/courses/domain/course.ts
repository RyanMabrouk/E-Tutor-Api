import { Language } from './../../languages/domain/language';
import { Category } from 'src/routes/categories/domain/category';
import { GeneralDomain } from '../../../shared/domain/general.domain';
import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { FileType } from 'src/routes/files/domain/file';
import { User } from 'src/routes/users/domain/user';
import { CourseLevelType } from '../types/CourseLevelType';
import { CourseStatusType } from '../types/CourseStatusType';

export class Course extends GeneralDomain {
  id: number;
  // Step1
  title: string;
  subtitle: string;
  category: Category;
  subcategory: Subcategory;
  topic: string;
  language: Language;
  subtitleLanguage: Language[];
  level: CourseLevelType;
  duration: number;
  // Step2
  thumbnail: FileType | null;
  trailer: FileType | null;
  description: JSON | null;
  subjects: string[] | null;
  audience: string[] | null;
  requirements: string[] | null;
  // Step3
  welcomeMessage: string | null;
  congratsMessage: string | null;
  price: number;
  discount: number;
  // Must exist
  instructors: User[];
  status: CourseStatusType;
}
