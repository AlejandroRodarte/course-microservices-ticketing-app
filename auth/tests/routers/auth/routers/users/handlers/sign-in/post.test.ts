import request from 'supertest';
import { objects, ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import app from '../../../../../../../src/app';
import SignInData from '../../../../../../../src/lib/objects/data/users/sign-in-data';

const routes = {
  'sign-in': '/auth/users/sign-in',
  'sign-up': '/auth/users/sign-up',
};

describe('Tests for the POST /auth/users/sign-in endpoint.', () => {
  describe('Success cases', () => {
    it('Should return a USER_LOGGED_IN code in case of successful sign-in.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      await request(app).post(routes['sign-up']).send(body).expect(200);

      const response = await request(app)
        .post(routes['sign-in'])
        .send(body)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<SignInData, undefined>;

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('USER_LOGGED_IN');
    });

    it('Should set cookie header in case of successful sign-in.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      await request(app).post(routes['sign-up']).send(body).expect(200);
      const response = await request(app)
        .post(routes['sign-in'])
        .send(body)
        .expect(200);

      expect(response.get('Set-Cookie')).toBeDefined();
    });
  });

  describe('Handler logic errors', () => {
    it('Should return a BadCredentialsError error in case no user exists in the database.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      const response = await request(app)
        .post(routes['sign-in'])
        .send(body)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('BAD_CREDENTIALS_ERROR');
    });

    it('Should return a BadCredentialsError error in case the password is wrong.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      await request(app).post(routes['sign-up']).send(body);
      body.data.credentials.password = 'wrong-password';

      const response = await request(app).post(routes['sign-in']).send(body);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('BAD_CREDENTIALS_ERROR');
    });
  });
});
