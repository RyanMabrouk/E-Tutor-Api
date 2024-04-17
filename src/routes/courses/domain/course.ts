import { Language } from './../../languages/domain/language';
import { Category } from 'src/routes/categories/domain/category';
import { GeneralDomain } from '../../../shared/domain/general.domain';
import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { FileType } from 'src/routes/files/domain/file';
import { User } from 'src/routes/users/domain/user';

export class Course extends GeneralDomain {
  id: number;
  title: string;
  subtitle: string;
  category: Category;
  subcategory: Subcategory;
  topic: string;
  language: Language;
  subtitleLanguage: Language[];
  level: CourseLevelType;
  duration: number;
  thumbnail: FileType;
  trailer: FileType;
  description: JSON;
  subjects: string[];
  audience: string[];
  requirements: string[];
  welcomeMessage: string;
  congratsMessage: string;
  price: number;
  discount: number;
  instructors: User[];
}
export enum CourseLevelEnum {
  All = 'All',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Expert = 'Expert',
}

export type CourseLevelType =
  | CourseLevelEnum.All
  | CourseLevelEnum.Beginner
  | CourseLevelEnum.Intermediate
  | CourseLevelEnum.Expert;
