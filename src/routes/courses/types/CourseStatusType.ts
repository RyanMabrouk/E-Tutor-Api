export enum CourseStatusEnum {
  draft = 'draft',
  toBeReviewed = 'toBeReviewed',
  published = 'published',
  rejected = 'rejected',
}

export type CourseStatusType =
  | CourseStatusEnum.draft
  | CourseStatusEnum.toBeReviewed
  | CourseStatusEnum.published
  | CourseStatusEnum.rejected;
