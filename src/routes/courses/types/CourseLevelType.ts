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
