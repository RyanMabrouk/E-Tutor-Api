import { TESTER_PASSWORD } from './../utils/constants';
import { Category } from '../../src/routes/categories/domain/category';
import { TestCasesArrayType } from '../types/TestCasesArrayType';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  TESTER_EMAIL,
} from '../utils/constants';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import { GeneralDomainKeys } from 'src/shared/domain/general.domain';
import { CreateCategoryDto } from 'src/routes/categories/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/routes/categories/dto/update-category.dto';
import request from 'supertest';
import { getAdminCookies } from '../utils/helpers/loginForCookies';

// Constants for this test
const route = '/api/v1/categories';
const mock: Omit<Category, GeneralDomainKeys> = {
  id: expect.any(Number) as number,
  name: expect.any(String) as string,
  color: expect.any(String) as string,
};
const postPayload: CreateCategoryDto = {
  name: new Date().getTime().toString(),
  color: faker.color.rgb(),
};
const patchPayload: UpdateCategoryDto = {
  name: String(new Date().getTime() - 10),
  color: faker.color.rgb(),
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all categories',
    method: 'get',
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      expect(data).toEqual(
        expect.arrayContaining([expect.objectContaining(mock)]),
      );
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should get category',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should post category',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch category',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete category',
    method: 'delete',
    path: `/1`,
    expectedStatus: 204,
  },
];

const forbiddenTestCases: TestCasesArrayType = [
  {
    it: 'should forbid user to post category',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to patch category',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to delete category',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];

export const getCategoryId = async (cookies: string) => {
  const {
    body: { id },
  } = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send({ ...postPayload, name: new Date().getTime().toString() });
  if (!id) throw new Error(`Category POST method failed`);
  return id;
};
testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: { id: getCategoryId },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});
testBuilder({
  route,
  testCases: forbiddenTestCases,
  getPayloadPlaceholderIds: {
    id: async () => {
      const cookies = await getAdminCookies();
      const id = await getCategoryId(cookies);
      return id;
    },
    toBeDeletedId: async () => {
      const cookies = await getAdminCookies();
      const id = await getCategoryId(cookies);
      return id;
    },
  },
  user: { email: TESTER_EMAIL, password: TESTER_PASSWORD },
});
