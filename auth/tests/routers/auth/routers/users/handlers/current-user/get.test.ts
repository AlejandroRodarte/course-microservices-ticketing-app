import request from 'supertest';
import app from '../../../../../../../src/app';
import helpers from '../../../../../../../src/lib/db/helpers';
import CurrentUserData from '../../../../../../../src/lib/objects/data/users/current-user-data';
import UniversalError from '../../../../../../../src/lib/objects/errors/universal-error';
import { ApplicationResponseTypes } from '../../../../../../../src/lib/types/objects/application-response';

const routes = {
  'sign-up': '/auth/users/sign-up',
  'current-user': '/auth/users/current-user',
};

describe('Tests for the GET /auth/users/current-user endpoint.', () => {
  describe('Success cases', () => {
    it('Should respond with 200 status, CURRENT_USER_FETCHED code, and user details when user accesses its own information.', async () => {
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
      const currentUserResponse = await request(app)
        .get(routes['current-user'])
        .set('Cookie', signUpResponse.get('Set-Cookie'))
        .expect(200);
      const applicationResponse =
        currentUserResponse.body as ApplicationResponseTypes.Body<
          CurrentUserData,
          undefined
        >;

      const [user] = await helpers.user.findOne({
        email: body.data.credentials.email,
      });

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('CURRENT_USER_FETCHED');
      expect(applicationResponse.data).toEqual({
        user: { id: user?.id, email: body.data.credentials.email },
      });
    });
  });

  describe('Handler logic errors', () => {
    it('Should return a 401 status when user has not logged in.', async () => {
      const response = await request(app)
        .get(routes['current-user'])
        .expect(200);
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
