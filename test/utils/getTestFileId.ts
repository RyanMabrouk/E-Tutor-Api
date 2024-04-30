import request from 'supertest';
import { APP_URL, TEST_FILE_PATH } from './constants';

export const getTestFileId = async (cookies: string) => {
  const res = await request(APP_URL)
    .get(`/api/v1/files/data/${TEST_FILE_PATH}`)
    .set('Cookie', cookies);
  const id = res.body.id;
  if (!id) throw new Error(`Get file method failed or file wasn't seeded`);
  return id;
};
