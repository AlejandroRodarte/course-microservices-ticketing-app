import request from 'supertest';
import app from '../../../../../../../src/app';
import SignUpData from '../../../../../../../src/lib/objects/data/users/sign-up-data';
import UniversalError from '../../../../../../../src/lib/objects/errors/universal-error';
import { ApplicationResponseTypes } from '../../../../../../../src/lib/types/objects/application-response';

const route = '/auth/users/sign-up';

describe('Tests for the POST /auth/users/sign-up endpoint.', () => {
  describe('Success cases', () => {
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
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<SignUpData, undefined>;

      expect(applicationResponse.status).toBe(201);
    });
  });

  describe('Validation errors', () => {
    it('Should return a 422 status code on invalid email credential.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'bad-email',
            password: 'password',
          },
        },
      };

      const response = await request(app).post(route).send(body).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(applicationResponse.status).toBe(422);
    });

    it('Should return a 422 status code on invalid password length.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'abc',
          },
        },
      };

      const response = await request(app).post(route).send(body).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(applicationResponse.status).toBe(422);
    });

    it('Should return a 422 status code if no email is provided', async () => {
      const body = {
        data: {
          credentials: {
            password: 'password',
          },
        },
      };

      const response = await request(app).post(route).send(body).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(applicationResponse.status).toBe(422);
    });

    it('Should return a 422 status code if no password is provided', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
          },
        },
      };

      const response = await request(app).post(route).send(body).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(applicationResponse.status).toBe(422);
    });

    it('Should return a 422 status code if no credentials are provided.', async () => {
      const body = {};

      const response = await request(app).post(route).send(body).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(applicationResponse.status).toBe(422);
    });
  });
});
