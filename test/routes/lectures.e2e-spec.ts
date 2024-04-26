import { TestCasesArrayType } from '../types/TestCasesArrayType';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  INSTRUCTOR_EMAIL,
  INSTRUCTOR_PASSWORD,
  TESTER_EMAIL,
  TESTER_PASSWORD,
  testFileId,
} from '../utils/constants';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import request from 'supertest';
import { convertAsyncObjectToSync } from '../utils/helpers/convertAsyncObjectToSync';
import { replacePaylaodPlaceholders } from '../utils/helpers/replacePaylaodPlaceholders';
import { getAdminCookies } from '../utils/helpers/getAdminCookies';
import { Section } from 'src/routes/sections/domain/section';
import { Lecture } from 'src/routes/lectures/domain/lecture';
import { FileType } from 'src/routes/files/domain/file';
import { CreateLectureDto } from 'src/routes/lectures/dto/create-lecture.dto';
import { UpdateLectureDto } from 'src/routes/lectures/dto/update-lecture.dto';
import { GeneralDomainMock } from '../utils/GeneralDomainMock';
import { getSectionId } from './sections.e2e-spec';
import { AddCourseToUser, getCourseId } from './courses.e2e-spec';

// Constants for this test
const route = '/api/v1/lectures';
const mock: Lecture = {
  id: expect.any(Number) as number,
  name: expect.any(String) as string,
  section: expect.any(Object) as Section,
  video: expect.any(Object) as FileType,
  attachement: expect.any(Object) as FileType,
  captions: expect.any(Array) as string[],
  descripstion: expect.any(String) as string,
  ...GeneralDomainMock,
};
const postPayload: CreateLectureDto = {
  name: faker.lorem.words(3),
  section: { id: ':sectionId' } as unknown as Section,
  video: { id: ':fileId' } as unknown as FileType,
  attachement: { id: ':fileId' } as unknown as FileType,
  captions: ['test'] as string[],
  descripstion: faker.lorem.words(3) as string,
};
const patchPayload: UpdateLectureDto = {
  name: faker.lorem.words(3),
  section: { id: ':sectionId' } as unknown as Section,
  video: { id: ':fileId' } as unknown as FileType,
  attachement: { id: ':fileId' } as unknown as FileType,
  captions: ['test'] as string[],
  descripstion: faker.lorem.words(3) as string,
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all lectures',
    method: 'get',
    path: '?sectionId=:sectionId',
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      for (const course of data) {
        expect(course).toEqual(expect.objectContaining(mock));
      }
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should get lecture',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should post lecture',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch lecture',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete lecture',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 204,
  },
];
const userTestCases: TestCasesArrayType = [
  {
    it: 'should allow user who didnt buy course to get all lectures',
    method: 'get',
    path: '?sectionId=:sectionId',
    expectedStatus: 200,
  },
  {
    it: 'should allow user to get lecture he bought',
    method: 'get',
    path: `/:ownedLectureId`,
    expectedStatus: 200,
  },
  {
    it: 'should forbid user who didnt buy course to get lecture',
    method: 'get',
    path: `/:id`,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to post lecture',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to patch lecture',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to delete lecture',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

const instructorTestCases: TestCasesArrayType = [
  {
    it: 'should forbid unauthorizd instructor post lecture',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid unauthorizd instructor patch lecture',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid unauthorizd instructor delete lecture',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

const placeHolders = {
  sectionId: getSectionId,
  fileId: async () => await testFileId,
};

export const getLectureId = async (
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
  if (!id) throw new Error(`Lecture POST method failed`);
  return id;
};

const getOwnedLectueId = async (userCookeis: string) => {
  const adminCookies = await getAdminCookies();
  const courseId: number = await getCourseId(adminCookies);
  const sectionId: number = await getSectionId(adminCookies, {
    courseId: async () => await courseId,
  });
  await AddCourseToUser(userCookeis, courseId);
  const id = await getLectureId(adminCookies, {
    sectionId: async () => await sectionId,
  });
  return id;
};

testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: {
    id: getLectureId,
    toBeDeletedId: getLectureId,
    ...placeHolders,
  },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});

const placeHoldersByAdmin = {
  sectionId: async () => {
    const cookies = await getAdminCookies();
    const id = await getSectionId(cookies);
    return id;
  },
  fileId: async () => await testFileId,
  id: async () => {
    const cookies = await getAdminCookies();
    const id = await getLectureId(cookies);
    return id;
  },
  toBeDeletedId: async () => {
    const cookies = await getAdminCookies();
    const id = await getLectureId(cookies);
    return id;
  },
};
testBuilder({
  route,
  testCases: userTestCases,
  getPayloadPlaceholderIds: {
    ownedLectureId: getOwnedLectueId,
    ...placeHoldersByAdmin,
  },
  user: { email: TESTER_EMAIL, password: TESTER_PASSWORD },
});

testBuilder({
  route,
  testCases: instructorTestCases,
  getPayloadPlaceholderIds: {
    ...placeHoldersByAdmin,
  },
  user: { email: INSTRUCTOR_EMAIL, password: INSTRUCTOR_PASSWORD },
});
