import request from 'supertest';
import { objects, ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import app from '../../../../../../../src/app';
import dbHelpers from '../../../../../../../src/lib/db/helpers';
import supertestHelpers from '../../../../../../lib/supertest/helpers';
import CurrentUserData from '../../../../../../../src/lib/objects/data/users/current-user-data';

const routes = {
  'sign-up': '/auth/users/sign-up',
  'current-user': '/auth/users/current-user',
};

describe('Tests for the GET /auth/users/current-user endpoint.', () => {
  describe('Success cases', () => {
    it('Should respond with 200 status, CURRENT_USER_FETCHED code, and user details when user accesses its own information.', async () => {
      const [signedUpUser, cookie] =
        await supertestHelpers.auth.signUpAndGetCookie();
      const currentUserResponse = await request(app)
        .get(routes['current-user'])
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        currentUserResponse.body as ApplicationResponseTypes.Body<
          CurrentUserData,
          undefined
        >;

      const [user] = await dbHelpers.user.findOne({
        email: signedUpUser.email,
      });

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('CURRENT_USER_FETCHED');
      expect(applicationResponse.data).toEqual({
        user: { id: user?.id, email: signedUpUser.email },
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
          InstanceType<typeof objects.errors.UniversalError>
        >;
      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });
  });
});
