import { TestCasesArrayType } from '../types/TestCasesArrayType';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import { Subcategory } from '../../src/routes/subcategories/domain/subcategory';
import { GeneralDomainKeys } from 'src/shared/domain/general.domain';
import { CreateSubcategoryDto } from 'src/routes/subcategories/dto/create-subcategory.dto';
import { Category } from 'src/routes/categories/domain/category';
import { UpdateSubcategoryDto } from 'src/routes/subcategories/dto/update-subcategory.dto';
import request from 'supertest';
import { getCategoryId } from './categories.e2e-spec';
import { getAdminCookies } from '../utils/helpers/getAdminCookies';

// Constants for this test
const route = '/api/v1/subcategories';
const mock: Omit<Subcategory, GeneralDomainKeys | 'category'> = {
  id: expect.any(Number) as number,
  name: expect.any(String) as string,
};
const postPayload: CreateSubcategoryDto = {
  name: faker.lorem.word(),
  category: {
    id: ':categoryId',
  } as unknown as Category, // this will be replaced with categoryId in test builder
};
const patchPayload: UpdateSubcategoryDto = {
  name: faker.lorem.word(),
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all subcategories',
    method: 'get',
    path: `?categoryId=:categoryId`,
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      if (data.length > 0) {
        expect(data).toEqual(
          expect.arrayContaining([expect.objectContaining(mock)]),
        );
      } else {
        expect(data).toEqual([]);
      }
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should get subcategory',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should post subcategory',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch subcategory',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete subcategory',
    method: 'delete',
    path: `/1`,
    expectedStatus: 204,
  },
];

const forbiddenTestCases: TestCasesArrayType = [
  {
    it: 'should forbid user to post subcategory',
    method: 'post',
    send: postPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to patch subcategory',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 403,
  },
  {
    it: 'should forbid user to delete subcategory',
    method: 'delete',
    path: `/:toBeDeletedId`,
    expectedStatus: 403,
  },
];
export const getSubcategoryId = async (cookies: string) => {
  const categoryId = await getCategoryId(cookies);
  const {
    body: { id },
  } = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send({ ...postPayload, category: { id: categoryId } });
  if (!id) throw new Error('Subcategory POST method failed');
  return id;
};
testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: { id: getSubcategoryId, categoryId: getCategoryId },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});
testBuilder({
  route,
  testCases: forbiddenTestCases,
  getPayloadPlaceholderIds: {
    id: async () => {
      const cookies = await getAdminCookies();
      const id = await getSubcategoryId(cookies);
      return id;
    },
    toBeDeletedId: async () => {
      const cookies = await getAdminCookies();
      const id = await getSubcategoryId(cookies);
      return id;
    },
    categoryId: async () => {
      const cookies = await getAdminCookies();
      const id = await getCategoryId(cookies);
      return id;
    },
  },
  user: { email: TESTER_EMAIL, password: TESTER_PASSWORD },
});
