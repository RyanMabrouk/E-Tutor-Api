import request from 'supertest';
import {
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
  MAIL_HOST,
  MAIL_PORT,
} from '../utils/constants';
import { formatCookiesFromRes } from '../utils/formatCookiesFromRes';

describe('Auth Module', () => {
  const app = APP_URL;
  const mail = `http://${MAIL_HOST}:${MAIL_PORT}`;
  const newUserFirstName = `Tester${Date.now()}`;
  const newUserLastName = `E2E`;
  const newUserEmail = `User.${Date.now()}@example.com`;
  const newUserPassword = `secret`;

  describe('Registration', () => {
    it('should fail with exists email: /api/v1/auth/email/register (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: TESTER_EMAIL,
          password: TESTER_PASSWORD,
          firstName: 'Tester',
          lastName: 'E2E',
        })
        .expect(422)
        .expect(({ body }) => {
          expect(body.errors.email).toBeDefined();
        });
    });

    it('should successfully: /api/v1/auth/email/register (POST)', async () => {
      return request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
          firstName: newUserFirstName,
          lastName: newUserLastName,
        })
        .expect(201);
    });

    describe('Login', () => {
      it('should successfully with unconfirmed email: /api/v1/auth/email/login (POST)', () => {
        return request(app)
          .post('/api/v1/auth/email/login')
          .send({ email: newUserEmail, password: newUserPassword })
          .expect(200)
          .expect(({ body }) => {
            expect(body.user).toBeDefined();
          });
      });
    });

    describe('Confirm email', () => {
      it('should successfully: /api/v1/auth/email/confirm (POST)', async () => {
        const hash = await request(mail)
          .get('/email')
          .then(({ body }) =>
            body
              .find(
                (letter) =>
                  letter.to[0].address.toLowerCase() ===
                    newUserEmail.toLowerCase() &&
                  /.*confirm\-email\?hash\=(\S+).*/g.test(letter.text),
              )
              ?.text.replace(/.*confirm\-email\?hash\=(\S+).*/g, '$1'),
          );

        return request(app)
          .post('/api/v1/auth/email/confirm')
          .send({
            hash,
          })
          .expect(201);
      });

      it('should fail for already confirmed email: /api/v1/auth/email/confirm (POST)', async () => {
        const hash = await request(mail)
          .get('/email')
          .then(({ body }) =>
            body
              .find(
                (letter) =>
                  letter.to[0].address.toLowerCase() ===
                    newUserEmail.toLowerCase() &&
                  /.*confirm\-email\?hash\=(\S+).*/g.test(letter.text),
              )
              ?.text.replace(/.*confirm\-email\?hash\=(\S+).*/g, '$1'),
          );

        return request(app)
          .post('/api/v1/auth/email/confirm')
          .send({
            hash,
          })
          .expect(404);
      });
    });
  });

  describe('Login', () => {
    it('should successfully for user with confirmed email: /api/v1/auth/email/login (POST)', () => {
      return request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.tokenExpires).toBeDefined();
          expect(body.user.email).toBeDefined();
          expect(body.user.hash).not.toBeDefined();
          expect(body.user.password).not.toBeDefined();
          expect(body.user.previousPassword).not.toBeDefined();
        });
    });
  });

  describe('Logged in user', () => {
    let cookies: string;
    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(200)
        .then((res) => {
          cookies = formatCookiesFromRes(
            res.headers['set-cookie'] as unknown as string[],
          );
        });
    });

    it('should retrieve your own profile: /api/v1/auth/me (GET)', async () => {
      await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', cookies)
        .send()
        .expect(({ body }) => {
          expect(body.provider).toBeDefined();
          expect(body.email).toBeDefined();
          expect(body.hash).not.toBeDefined();
          expect(body.password).not.toBeDefined();
          expect(body.previousPassword).not.toBeDefined();
        });
    });

    it('should get new refresh token: /api/v1/auth/refresh (POST)', async () => {
      const newUserRefreshToken = await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then((res) =>
          formatCookiesFromRes(
            res.headers['set-cookie'] as unknown as string[],
          ),
        );

      await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', newUserRefreshToken)
        .send()
        .expect(200);
    });

    it('should fail on the second attempt to refresh token with the same token: /api/v1/auth/refresh (POST)', async () => {
      const newUserRefreshToken = await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then((res) =>
          formatCookiesFromRes(
            res.headers['set-cookie'] as unknown as string[],
          ),
        );

      await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', newUserRefreshToken)
        .send();

      await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', newUserRefreshToken)
        .send()
        .expect(401);
    });

    it('should update profile successfully: /api/v1/auth/me (PATCH)', async () => {
      const newUserNewName = Date.now();
      const newUserNewPassword = 'new-secret';
      const cookies = await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then((res) =>
          formatCookiesFromRes(
            res.headers['set-cookie'] as unknown as string[],
          ),
        );

      await request(app)
        .patch('/api/v1/auth/me')
        .set('Cookie', cookies)
        .send({
          firstName: newUserNewName,
          password: newUserNewPassword,
        })
        .expect(422);

      await request(app)
        .patch('/api/v1/auth/me')
        .set('Cookie', cookies)
        .send({
          firstName: newUserNewName,
          password: newUserNewPassword,
          oldPassword: newUserPassword,
        })
        .expect(200);

      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserNewPassword })
        .expect(200)
        .expect(({ body }) => {
          expect(body.tokenExpires).toBeDefined();
          expect(body.user).toBeDefined();
        });

      await request(app)
        .patch('/api/v1/auth/me')
        .set('Cookie', cookies)
        .send({ password: newUserPassword, oldPassword: newUserNewPassword })
        .expect(200);
    });

    it('should delete profile successfully: /api/v1/auth/me (DELETE)', async () => {
      const cookies = await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then((res) =>
          formatCookiesFromRes(
            res.headers['set-cookie'] as unknown as string[],
          ),
        );

      await request(app)
        .delete('/api/v1/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      return request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .expect(400);
    });
  });
});
