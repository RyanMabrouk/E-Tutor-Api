import { CreateLanguageDto } from 'src/routes/languages/dto/create-language.dto';
import request from 'supertest';
import { APP_URL } from '../utils/constants';

const route = '/api/v1/languages';
const postPayload: CreateLanguageDto = {
  name: 'English',
};
export const getLanguageId = async (cookies: string) => {
  const res = await request(APP_URL)
    .post(route)
    .set('Cookie', cookies)
    .send(postPayload);
  const id = res.body.id;
  if (!id) throw new Error(`Language POST method failed`);
  return id;
};
