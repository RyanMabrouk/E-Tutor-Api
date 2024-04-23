import { TestCasesArrayType } from '../types/TestCasesArrayType';
import request from 'supertest';
import { APP_URL } from './constants';
import { replacePaylaodPlaceholders } from './helpers/replacePaylaodPlaceholders';
import { convertAsyncObjectToSync } from './helpers/convertAsyncObjectToSync';
import { loginForCookies } from './loginForCookies';
type getPayloadPlaceholderIdsType = {
  [key: string]: (cookies: string) => Promise<number | string | null>;
};
export function testBuilder({
  route,
  testCases,
  user: { email, password },
  getPayloadPlaceholderIds,
  runBeforeAll,
}: {
  route: string;
  testCases: TestCasesArrayType;
  user: { email: string; password: string };
  getPayloadPlaceholderIds?: getPayloadPlaceholderIdsType; // syntax any :id in path or payload
  runBeforeAll?: () => void;
}) {
  return describe(`${route} module`, () => {
    const app = APP_URL;
    let cookies: string = '';
    let payloadPlaceholderIds: {
      [key: string]: number | string | null;
    } = {};

    beforeAll(async () => {
      try {
        runBeforeAll ? runBeforeAll() : null;
        cookies = await loginForCookies({ email, password });
        payloadPlaceholderIds = await convertAsyncObjectToSync(
          cookies,
          getPayloadPlaceholderIds,
        );
      } catch (error) {
        console.error('Error during request:', error);
      }
    });

    for (const test of testCases) {
      let req: request.Test | null = null;
      if (!test.it.startsWith('should')) {
        throw new Error(
          `Test case description "${test.it}" does not start with "should"`,
        );
      }
      // eslint-disable-next-line no-restricted-syntax --- it starts with "should"
      it(
        test.it +
          ' ' +
          route +
          (test.path ?? '') +
          ' ' +
          test.method.toUpperCase(),
        () => {
          // add route to path
          test.path = route + (test.path ?? '');
          // replace placeholders in path
          test.path = test.path.replace(
            /:([a-zA-Z0-9_]+)/g,
            (_, placeholder): string => {
              return String(payloadPlaceholderIds[placeholder]) ?? '';
            },
          );
          // replace payload placeholders
          if (test.send) {
            test.send = replacePaylaodPlaceholders(
              test.send,
              payloadPlaceholderIds,
            );
          }
          console.log('🚀 --------------------------');
          console.log(test.method.toUpperCase());
          console.log('🚀 ~ returndescribe ~ test.send:', test.send);
          console.log('🚀 ~ returndescribe ~ test.path:', test.path);
          console.log('🚀 --------------------------');
          if (test.path.includes(':id')) {
            throw new Error(
              `Test case "${test.it}" with path "${test.path}" does not have id`,
            );
          }
          if (test.method === 'post') {
            req = request(app).post(test.path).send(test.send);
          }
          if (test.method === 'get') {
            req = request(app).get(test.path);
          }
          if (test.method === 'patch') {
            req = request(app).patch(test.path).send(test.send);
          }
          if (test.method === 'delete') {
            req = request(app).delete(test.path);
          }
          if (
            test.path === undefined &&
            (test.method === 'get' || test.method === 'patch')
          ) {
            throw new Error(
              `Test case "${test.it}" with method "${test.method}" does not have path`,
            );
          }
          if (
            test.path === undefined &&
            (test.method === 'get' || test.method === 'patch')
          ) {
            throw new Error(
              `Test case "${test.it}" with method "${test.method}" does not have path`,
            );
          }
          if (req === null) {
            throw new Error('Request builder failed');
          }
          req = req
            .set('Cookie', test.public ? '' : cookies)
            .expect(test.expectedStatus);
          if (test.expectedResponse) {
            req = req.expect(test.expectedResponse);
          }
          return req;
        },
      );
    }
  });
}
