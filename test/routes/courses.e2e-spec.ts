import { TestCasesArrayType } from '../types/TestCasesArrayType';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  INSTRUCTOR_EMAIL,
  INSTRUCTOR_PASSWORD,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import request from 'supertest';
import { Course } from 'src/routes/courses/domain/course';
import { CreateCourseDto } from 'src/routes/courses/dto/create-course.dto';
import { UpdateCourseDto } from 'src/routes/courses/dto/update-course.dto';
import { GeneralDomainMock } from '../utils/GeneralDomainMock';
import { Category } from 'src/routes/categories/domain/category';
import { Subcategory } from 'src/routes/subcategories/domain/subcategory';
import { CourseLevelEnum } from '../../src/routes/courses/types/CourseLevelType';
import { Language } from '../../src/routes/languages/domain/language';
import { getCategoryId } from './categories.e2e-spec';
import { getSubcategoryId } from './subcategories.e2e-spec';
import { getLanguageId } from './language.e2e-spec';
import { convertAsyncObjectToSync } from '../utils/helpers/convertAsyncObjectToSync';
import { replacePaylaodPlaceholders } from '../utils/helpers/replacePaylaodPlaceholders';
import { isNullOrType } from '../utils/helpers/jest-validators/isNullOrType';
import { User } from '../../src/routes/users/domain/user';
import { CourseStatusType } from '../../src/routes/courses/types/CourseStatusType';
import { getAdminCookies } from '../utils/helpers/get-cookies/getAdminCookies';
import { AuthUpdateDto } from 'src/auth/dto/auth-update.dto';
expect.extend({
  toBeNullOrType: isNullOrType,
});
// Constants for this test
const route = '/api/v1/courses';
const mock: Course = {
  id: expect.any(Number) as number,
  title: expect.any(String) as string,
  subtitle: expect.any(String) as string,
  category: expect.any(Object) as Category,
  subcategory: expect.any(Object) as Subcategory,
  topic: expect.any(String) as string,
  language: expect.any(Object) as Language,
  subtitleLanguage: expect.any(Array) as Language[],
  level: expect.any(String) as CourseLevelEnum,
  duration: expect.any(Number) as number,
  // Step2
  // @ts-expect-error valid
  thumbnail: expect.toBeNullOrType('object') as FileType | null,
  // @ts-expect-error valid
  trailer: expect.toBeNullOrType('object') as FileType | null,
  // @ts-expect-error valid
  description: expect.toBeNullOrType('string') as JSON | null,
  // @ts-expect-error valid
  subjects: expect.toBeNullOrType('array') as string[] | null,
  // @ts-expect-error valid
  audience: expect.toBeNullOrType('array') as string[] | null,
  // @ts-expect-error valid
  requirements: expect.toBeNullOrType('array') as string[] | null,
  // Step3
  // @ts-expect-error valid
  welcomeMessage: expect.toBeNullOrType('string') as string | null,
  // @ts-expect-error valid
  congratsMessage: expect.toBeNullOrType('string') as string | null,
  price: expect.any(Number) as number,
  discount: expect.any(Number) as number,
  // Must exist
  instructors: expect.any(Array) as User[],
  status: expect.any(String) as CourseStatusType,
  ...GeneralDomainMock,
};
const postPayload: CreateCourseDto = {
  title: faker.lorem.words(3),
  subtitle: faker.lorem.words(3),
  category: { id: ':categoryId' } as unknown as Category,
  subcategory: { id: ':subcategoryId' } as unknown as Subcategory,
  topic: faker.lorem.words(3),
  language: { id: ':languageId' } as unknown as Language,
  subtitleLanguage: [{ id: ':languageId' }] as unknown as Language[],
  level: CourseLevelEnum.All,
  duration: 10,
};
const patchPayload: UpdateCourseDto = {
  title: faker.lorem.words(3),
  subtitle: faker.lorem.words(3),
  category: { id: ':categoryId' } as unknown as Category,
  subcategory: { id: ':subcategoryId' } as unknown as Subcategory,
  topic: faker.lorem.words(3),
  language: { id: ':languageId' } as unknown as Language,
  subtitleLanguage: [{ id: ':languageId' }] as unknown as Language[],
  level: CourseLevelEnum.All,
  duration: 10,
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all courses',
    method: 'get',
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      for (const course of data) {
        expect(course).toEqual(expect.objectContaining(mock));
      }
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should get course',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should post course',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch course',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete course',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 204,
  },
];
const forbiddenTestCases: TestCasesArrayType = [
  {
    it: 'should forbid user to post course',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to patch course',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to delete course',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

const unauthorizedTestCases: TestCasesArrayType = [
  {
    it: 'should forbid unauthorizd instructor patch course',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid unauthorizd instructor delete course',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

const placeHolders = {
  categoryId: getCategoryId,
  subcategoryId: getSubcategoryId,
  languageId: getLanguageId,
};
const placeHoldersByAdmin = {
  categoryId: async () => {
    const cookies = await getAdminCookies();
    const id = await getCategoryId(cookies);
    return id;
  },
  subcategoryId: async () => {
    const cookies = await getAdminCookies();
    const id = await getSubcategoryId(cookies);
    return id;
  },
  languageId: async () => {
    const cookies = await getAdminCookies();
    const id = await getLanguageId(cookies);
    return id;
  },
  id: async () => {
    const cookies = await getAdminCookies();
    const id = await getCourseId(cookies);
    return id;
  },
  toBeDeletedId: async () => {
    const cookies = await getAdminCookies();
    const id = await getCourseId(cookies);
    return id;
  },
};
export const getCourseId = async (cookies: string) => {
  const placeholders = await convertAsyncObjectToSync(cookies, placeHolders);
  const validPostPayload = replacePaylaodPlaceholders(
    postPayload,
    placeholders,
  );
  const res = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send(validPostPayload);
  const id = res.body.id;
  if (!id) throw new Error(`Course POST method failed`);
  return id;
};

export const AddCourseToUser = async (cookies: string, courseId: number) => {
  const payload: AuthUpdateDto = { courses: [{ id: courseId } as Course] };
  const res = await request(APP_URL)
    .patch('/api/v1/auth/me')
    .set('Cookie', cookies)
    .send(payload);
  if (!res.body.courses.some((course: Course) => course.id === courseId)) {
    throw new Error(`User PATCH method failed`);
  }
};

testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: {
    id: getCourseId,
    toBeDeletedId: getCourseId,
    ...placeHolders,
  },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});

testBuilder({
  route,
  testCases: forbiddenTestCases,
  getPayloadPlaceholderIds: {
    ...placeHoldersByAdmin,
  },
  user: { email: TESTER_EMAIL, password: TESTER_PASSWORD },
});

testBuilder({
  route,
  testCases: unauthorizedTestCases,
  getPayloadPlaceholderIds: {
    ...placeHoldersByAdmin,
  },
  user: { email: INSTRUCTOR_EMAIL, password: INSTRUCTOR_PASSWORD },
});
