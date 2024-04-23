import request from 'supertest';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_URL } from '../constants';
import { formatCookiesFromRes } from './formatCookiesFromRes';

export async function loginForCookies({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const app = APP_URL;
  const res = await request(app)
    .post('/api/v1/auth/email/login')
    .send({ email: email, password: password });

  if (!res.headers['set-cookie']) {
    throw new Error('Set-Cookie header is not set in the response');
  }

  const cookies = formatCookiesFromRes(
    res.headers['set-cookie'] as unknown as string[],
  );

  if (!cookies) {
    throw new Error('Cookies are not set after formatting');
  }
  return cookies;
}

export const getAdminCookies = async () => {
  const cookies = loginForCookies({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  return cookies;
};
