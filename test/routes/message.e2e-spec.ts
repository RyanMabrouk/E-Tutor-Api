import { TestCasesArrayType } from '../types/TestCasesArrayType';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  GeneralDomainMock,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants';
import { faker } from '@faker-js/faker';
import { testBuilder } from '../utils/test.builder';
import { getAdminCookies } from '../utils/loginForCookies';
import request from 'supertest';
import { CreateMessageDto } from 'src/routes/messages/dto/create-message.dto';
import { UpdateMessageDto } from 'src/routes/messages/dto/update-message.dto';
import { Chat } from 'src/routes/chat/domain/chat';
import { Message } from 'src/routes/messages/domain/message';
import { MessageTypesType } from 'src/routes/messages/types/MessageTypes';
import { getChatId } from './chat.e2e-spec';

// Constants for this test
const route = '/api/v1/messages';
const mock: Message = {
  id: expect.any(Number) as number,
  content: expect.any(String) as string,
  seen: expect.any(Boolean) as boolean,
  chat: expect.any(Object),
  sender: expect.any(Object),
  type: expect.any(String),
  ...GeneralDomainMock,
};
const postPayload: CreateMessageDto = {
  content: faker.lorem.word(),
  seen: false,
  chat: { id: ':chatId' } as unknown as Chat, // this will be replaced with chatId in test builder
  type: 'text' as MessageTypesType,
};
const patchPayload: UpdateMessageDto = {
  type: 'text' as MessageTypesType,
  content: faker.lorem.word(),
  seen: true,
};
// Test cases
const testCases: TestCasesArrayType = [
  {
    it: 'should get all message in chat',
    method: 'get',
    path: `?chatId=:chatId`,
    expectedStatus: 200,
    expectedResponse: ({ body: { data, hasNextPage } }) => {
      data.forEach((e) => {
        expect(e).toEqual(mock);
      });
      expect(hasNextPage).toEqual(expect.any(Boolean));
    },
  },
  {
    it: 'should post message',
    method: 'post',
    send: postPayload,
    expectedStatus: 201,
  },
  {
    it: 'should patch message',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 200,
    expectedResponse: ({ body }) => {
      expect(body).toEqual(expect.objectContaining(mock));
    },
  },
  {
    it: 'should delete message',
    method: 'delete',
    path: `/:id`,
    expectedStatus: 204,
  },
];

const unautherizedTestCases: TestCasesArrayType = [
  {
    it: 'should not get messages if not in chat',
    method: 'get',
    path: `?chatId=:chatId`,
    expectedStatus: 401,
  },
  {
    it: 'should not patch message if not in chat',
    method: 'patch',
    path: `/:id`,
    send: patchPayload,
    expectedStatus: 401,
  },
  {
    it: 'should not delete message if not in chat',
    method: 'delete',
    path: `/:id`,
    expectedStatus: 401,
  },
];

const getMsgId = async (cookies: string) => {
  const chatId = await getChatId(cookies);
  const {
    body: { id },
  } = await request(APP_URL)
    .post(`${route}?chatId=${chatId}`)
    .set('Cookie', cookies)
    .send({ ...postPayload, chat: { id: chatId } });
  if (!id) throw new Error('Message POST method failed');
  return id;
};

testBuilder({
  route,
  testCases,
  getPayloadPlaceholderIds: { chatId: getChatId, id: getMsgId },
  user: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
});

testBuilder({
  route,
  testCases: unautherizedTestCases,
  getPayloadPlaceholderIds: {
    id: async () => {
      const cookies = await getAdminCookies();
      return await getMsgId(cookies);
    },
    chatId: async () => {
      const cookies = await getAdminCookies();
      return await getChatId(cookies);
    },
  },
  user: { email: TESTER_EMAIL, password: TESTER_PASSWORD },
});
