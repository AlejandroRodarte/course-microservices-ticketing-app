import request from 'supertest';
import app from '../../../../../../../src/app';
import UniversalError from '../../../../../../../src/lib/objects/errors/universal-error';
import { ApplicationResponseTypes } from '../../../../../../../src/lib/types/objects/application-response';

const routes = {
  'sign-up': '/auth/users/sign-up',
  'sign-out': '/auth/users/sign-out',
};

describe('Tests for the POST /auth/users/sign-out endpoint.', () => {
  describe('Success cases', () => {
    it('Should return a 204 status code and delete the jwt cookie when logging out.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      const signUpResponse = await request(app)
        .post(routes['sign-up'])
        .send(body)
        .expect(200);

      const logoutResponse = await request(app)
        .post(routes['sign-out'])
        .set('Cookie', signUpResponse.get('Set-Cookie'))
        .expect(200);
      const applicationResponse =
        logoutResponse.body as ApplicationResponseTypes.Body<
          undefined,
          undefined
        >;

      const [cookie] = logoutResponse.get('Set-Cookie');

      expect(applicationResponse.status).toBe(204);
      expect(applicationResponse.code).toBe('USER_LOGGED_OUT');
      expect(cookie).toBe(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
      );
    });
  });

  describe('Handler logic errors', () => {
    it('Should return a 401 status code if there is no logged in user', async () => {
      const response = await request(app).post(routes['sign-out']).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });
  });
});
