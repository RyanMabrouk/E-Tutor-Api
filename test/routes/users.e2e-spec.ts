import {
  APP_URL,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  INSTRUCTOR_EMAIL,
} from '../utils/constants';
import request from 'supertest';
import { RoleEnum } from '../../src/routes/roles/roles.enum';
import { StatusEnum } from '../../src/routes/statuses/statuses.enum';
import { User } from 'src/routes/users/domain/user';
import { formatCookiesFromRes } from '../utils/helpers/formatCookiesFromRes';

describe('Users Module', () => {
  const app = APP_URL;
  let cookies: string;

  beforeAll(async () => {
    await request(app)
      .post('/api/v1/auth/email/login')
      .send({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
      .then(({ headers }) => {
        cookies = formatCookiesFromRes(
          headers['set-cookie'] as unknown as string[],
        );
      });
  });

  describe('Update', () => {
    let newUser: User;
    const newUserEmail = `user-first.${Date.now()}@example.com`;
    const newUserPassword = `secret`;
    const newUserChangedPassword = `new-secret`;

    beforeAll(async () => {
      await request(app)
        .post('/api/v1/auth/email/register')
        .send({
          email: newUserEmail,
          password: newUserPassword,
          firstName: `First${Date.now()}`,
          lastName: 'E2E',
        });

      await request(app)
        .post('/api/v1/auth/email/login')
        .send({ email: newUserEmail, password: newUserPassword })
        .then(({ body }) => {
          newUser = body.user;
        });
    });

    describe('User with "Admin" role', () => {
      it('should change password for existing user: /api/v1/users/:id (PATCH)', () => {
        return request(app)
          .patch(`/api/v1/users/${newUser.id}`)
          .set('Cookie', cookies)
          .send({ password: newUserChangedPassword })
          .expect(200);
      });

      describe('Guest', () => {
        it('should login with changed password: /api/v1/auth/email/login (POST)', () => {
          return request(app)
            .post('/api/v1/auth/email/login')
            .send({
              email: newUserEmail,
              password: newUserChangedPassword,
            })
            .expect(200)
            .expect(({ body }) => {
              expect(body.tokenExpires).toBeDefined();
              expect(body.user).toBeDefined();
            });
        });
      });
    });
  });

  describe('Create', () => {
    const newUserByAdminEmail = `user-created-by-admin.${Date.now()}@example.com`;
    const newUserByAdminPassword = `secret`;

    describe('User with "Admin" role', () => {
      it('should fail to create new user with invalid email: /api/v1/users (POST)', () => {
        return request(app)
          .post(`/api/v1/users`)
          .set('Cookie', cookies)
          .send({ email: 'fail-data' })
          .expect(422);
      });

      it('should successfully create new user: /api/v1/users (POST)', () => {
        return request(app)
          .post(`/api/v1/users`)
          .set('Cookie', cookies)
          .send({
            email: newUserByAdminEmail,
            password: newUserByAdminPassword,
            firstName: `UserByAdmin${Date.now()}`,
            lastName: 'E2E',
            role: {
              id: RoleEnum.user,
            },
            status: {
              id: StatusEnum.active,
            },
            provider: 'email',
          })
          .expect(201);
      });

      describe('Guest', () => {
        it('should successfully login via created by admin user: /api/v1/auth/email/login (GET)', () => {
          return request(app)
            .post('/api/v1/auth/email/login')
            .send({
              email: newUserByAdminEmail,
              password: newUserByAdminPassword,
            })
            .expect(200)
            .expect(({ body }) => {
              expect(body.tokenExpires).toBeDefined();
              expect(body.user).toBeDefined();
            });
        });
      });
    });
  });

  describe('Get many', () => {
    describe('User with "Admin" role', () => {
      it('should get list of users: /api/v1/users (GET)', () => {
        return request(app)
          .get(`/api/v1/users`)
          .set('Cookie', cookies)
          .expect(200)
          .send()
          .expect(({ body }) => {
            expect(body.data[0].provider).toBeDefined();
            expect(body.data[0].email).toBeDefined();
            expect(body.data[0].hash).not.toBeDefined();
            expect(body.data[0].password).not.toBeDefined();
            expect(body.data[0].previousPassword).not.toBeDefined();
          });
      });
    });
  });
});

export const getInstructorId = async (cookies: string) => {
  const {
    body: { data },
  } = await request(APP_URL)
    .get(`/api/v1/users?filters={"email":"${INSTRUCTOR_EMAIL}"}`)
    .set('Cookie', cookies);
  if (!data || data.length === 0)
    throw new Error(`Users Get All method failed or user wasn't seeded`);
  return data[0].id;
};
