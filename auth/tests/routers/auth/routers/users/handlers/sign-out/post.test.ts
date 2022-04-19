import request from 'supertest';
import app from '../../../../../../../src/app';
import UniversalError from '../../../../../../../src/lib/objects/errors/universal-error';
import { ApplicationResponseTypes } from '../../../../../../../src/lib/types/objects/application-response';
import helpers from '../../../../../../lib/supertest/helpers';

const routes = {
  'sign-up': '/auth/users/sign-up',
  'sign-out': '/auth/users/sign-out',
};

describe('Tests for the POST /auth/users/sign-out endpoint.', () => {
  describe('Success cases', () => {
    it('Should return a 204 status code and delete the jwt cookie when logging out.', async () => {
      const [, signUpCookie] = await helpers.auth.signUpAndGetCookie();

      const logoutResponse = await request(app)
        .post(routes['sign-out'])
        .set('Cookie', signUpCookie)
        .expect(200);
      const applicationResponse =
        logoutResponse.body as ApplicationResponseTypes.Body<
          undefined,
          undefined
        >;

      const [logoutCookie] = logoutResponse.get('Set-Cookie');

      expect(applicationResponse.status).toBe(204);
      expect(applicationResponse.code).toBe('USER_LOGGED_OUT');
      expect(logoutCookie).toBe(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=none; httponly'
      );
    });
  });

  describe('Handler logic errors', () => {
    it('Should return a 401 status code if there is no logged in user', async () => {
      const response = await request(app).post(routes['sign-out']).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });
  });
});
