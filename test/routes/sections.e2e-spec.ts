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
import { convertAsyncObjectToSync } from '../utils/helpers/convertAsyncObjectToSync';
import { replacePaylaodPlaceholders } from '../utils/helpers/replacePaylaodPlaceholders';
import { getAdminCookies } from '../utils/helpers/get-cookies/getAdminCookies';
import { Section } from 'src/routes/sections/domain/section';
import { CreateSectionDto } from 'src/routes/sections/dto/create-section.dto';
import { UpdateSectionDto } from 'src/routes/sections/dto/update-section.dto';
import { GeneralDomainKeys } from 'src/shared/domain/general.domain';
import { getCourseId } from './courses.e2e-spec';

// Constants for this test
const route = '/api/v1/sections';
const mock: Omit<Section, GeneralDomainKeys | 'course'> = {
  id: expect.any(Number) as number,
  name: expect.any(String) as string,
};
const postPayload: CreateSectionDto = {
  name: faker.lorem.words(3),
  course: { id: ':courseId' } as unknown as Course,
};
const patchPayload: UpdateSectionDto = {
  name: faker.lorem.words(3),
  course: { id: ':courseId' } as unknown as Course,
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all sections',
    method: 'get',
    path: '?courseId=:courseId',
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      for (const course of data) {
        expect(course).toEqual(expect.objectContaining(mock));
      }
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should get section',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should post section',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch section',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete section',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 204,
  },
];
const forbiddenTestCases: TestCasesArrayType = [
  {
    it: 'should forbid user to post section',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to patch section',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to delete section',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

const unauthorizedTestCases: TestCasesArrayType = [
  {
    it: 'should forbid unauthorizd instructor post section',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid unauthorizd instructor patch section',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid unauthorizd instructor delete section',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

const placeHolders = {
  courseId: getCourseId,
};
const placeHoldersByAdmin = {
  courseId: async () => {
    const cookies = await getAdminCookies();
    const id = await getCourseId(cookies);
    return id;
  },
  id: async () => {
    const cookies = await getAdminCookies();
    const id = await getSectionId(cookies);
    return id;
  },
  toBeDeletedId: async () => {
    const cookies = await getAdminCookies();
    const id = await getSectionId(cookies);
    return id;
  },
};
export const getSectionId = async (
  cookies: string,
  overidePlaceHolders?: { [key: string]: (cookies: string) => Promise<any> },
) => {
  const placeholders = await convertAsyncObjectToSync(cookies, {
    ...placeHolders,
    ...overidePlaceHolders,
  });
  const validPostPayload = replacePaylaodPlaceholders(
    postPayload,
    placeholders,
  );
  const res = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send(validPostPayload);
  const id = res.body.id;
  if (!id) throw new Error(`Section POST method failed`);
  return id;
};

testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: {
    id: getSectionId,
    toBeDeletedId: getSectionId,
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
