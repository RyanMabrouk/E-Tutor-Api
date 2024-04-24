import { TestCasesArrayType } from '../types/TestCasesArrayType';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
  testUserIds,
} from '../utils/constants';
import { GeneralDomainMock } from '../utils/GeneralDomainMock';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import { CreateChatDto } from 'src/routes/chat/dto/create-chat.dto';
import { UpdateChatDto } from 'src/routes/chat/dto/update-chat.dto';
import { User } from 'src/routes/users/domain/user';
import { Chat } from 'src/routes/chat/domain/chat';
import request from 'supertest';
import { getAdminCookies } from '../utils/helpers/getAdminCookies';

// Constants for this test
const route = '/api/v1/chat';
const mock: Chat = {
  id: expect.any(Number) as number,
  title: expect.any(String) as string,
  members: expect.any(Array),
  ...GeneralDomainMock,
};
const postPayload: CreateChatDto = {
  title: faker.lorem.word(),
  members: testUserIds.map((id) => ({ id }) as User),
};
const patchPayload: UpdateChatDto = {
  title: faker.lorem.word(),
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all chats',
    method: 'get',
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      data.forEach((chat) => {
        expect(chat).toEqual(mock);
        chat.members.forEach((member) => {
          if (member.photo !== null) {
            expect(member.photo).toEqual(
              expect.objectContaining({
                id: expect.any(String),
                path: expect.any(String),
              }),
            );
          } else {
            expect(member.photo).toBeNull();
          }
        });
      });
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should post chat',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
  },

  {
    it: 'should get chat',
    method: 'get',
    path: `/:id`,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should patch chat',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete chat',
    method: 'delete',
    path: `/:id`,
    expectedStatus: 204,
  },
];

const unautherizedTestCases: TestCasesArrayType = [
  {
    it: 'should not get chat if not in it',
    method: 'get',
    path: `/:chatId`,
    expectedStatus: 401,
  },
  {
    it: 'should not patch chat if not in it',
    method: 'patch',
    path: `/:chatId`,
    send: patchPayload,
    expectedStatus: 401,
  },
  {
    it: 'should not delete chat if not in it',
    method: 'delete',
    path: `/:chatId`,
    expectedStatus: 401,
  },
];

export const getChatId = async (cookies: string) => {
  const {
    body: { id },
  } = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send(postPayload);
  if (!id) throw new Error(`Chat POST method failed`);
  return id;
};

testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: { id: getChatId },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});

testBuilder({
  route,
  testCases: unautherizedTestCases,
  getPayloadPlaceholderIds: {
    chatId: async () => {
      const cookies = await getAdminCookies();
      return await getChatId(cookies);
    },
  },
  user: { email: TESTER_EMAIL, password: TESTER_PASSWORD },
});
