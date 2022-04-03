import request from 'supertest';
import app from '../../../../../../../src/app';
import SignUpData from '../../../../../../../src/lib/objects/data/users/sign-up-data';
import { ApplicationResponseTypes } from '../../../../../../../src/lib/types/objects/application-response';

const route = '/auth/users/sign-up';

describe('Tests for the POST /auth/users/sign-up endpoint.', () => {
  it('Should return a 201 status code on successful sign-up.', async () => {
    const body = {
      data: {
        credentials: {
          email: 'test@test.com',
          password: 'password',
        },
      },
    };

    const response = await request(app).post(route).send(body).expect(200);
    const applicationResponse = response.body as ApplicationResponseTypes.Body<
      SignUpData,
      undefined
    >;
    expect(applicationResponse.status).toBe(201);
  });
});
