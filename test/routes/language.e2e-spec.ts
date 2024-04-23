import { TestCasesArrayType } from '../types/TestCasesArrayType';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../utils/constants';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import { GeneralDomainKeys } from 'src/shared/domain/general.domain';
import request from 'supertest';
import { Language } from 'src/routes/languages/domain/language';
import { CreateLanguageDto } from 'src/routes/languages/dto/create-language.dto';
import { UpdateLanguageDto } from 'src/routes/languages/dto/update-language.dto';

// Constants for this test
const route = '/api/v1/languages';
const mock: Omit<Language, GeneralDomainKeys> = {
  id: expect.any(Number) as number,
  name: expect.any(String) as string,
};
const postPayload: CreateLanguageDto = {
  name: faker.lorem.word(),
};
const patchPayload: UpdateLanguageDto = {
  name: faker.lorem.word(),
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all Languages',
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
    it: 'should get language',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should post language',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch language',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete language',
    method: 'delete',
    path: `/1`,
    expectedStatus: 200,
  },
];
export const getLanguageId = async (cookies: string) => {
  const {
    body: { id },
  } = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send({ ...postPayload, name: new Date().getTime().toString() });
  if (!id) throw new Error(`Language POST method failed`);
  return id;
};
testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: { id: getLanguageId },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});
