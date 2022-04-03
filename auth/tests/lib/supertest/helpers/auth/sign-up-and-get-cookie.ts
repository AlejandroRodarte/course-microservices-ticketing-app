import request from 'supertest';
import app from '../../../../../src/app';
import { SupertestTypes } from '../../../types/supertest';

const signUpAndGetCookie: SupertestTypes.SignUpAndGetCookieFunction =
  async () => {
    const body = {
      data: {
        credentials: {
          email: 'test@test.com',
          password: 'password',
        },
      },
    };

    const response = await request(app)
      .post('/auth/users/sign-up')
      .send(body)
      .expect(200);

    const user = body.data.credentials;
    const cookie = response.get('Set-Cookie');
    return [user, cookie];
  };

export default signUpAndGetCookie;
