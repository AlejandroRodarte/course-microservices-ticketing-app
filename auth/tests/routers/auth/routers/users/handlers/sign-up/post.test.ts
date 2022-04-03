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

    it('Should set a cookie header after successful sign-up.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      const response = await request(app).post(route).send(body).expect(200);
      expect(response.get('Set-Cookie')).toBeDefined();
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

  describe('Handler logic errors', () => {
    it('Should return a BadEntityError error in case of a duplicate email.', async () => {
      const body = {
        data: {
          credentials: {
            email: 'test@test.com',
            password: 'password',
          },
        },
      };

      const firstResponse = await request(app)
        .post(route)
        .send(body)
        .expect(200);
      const firstApplicationResponse =
        firstResponse.body as ApplicationResponseTypes.Body<
          SignUpData,
          undefined
        >;

      expect(firstApplicationResponse.status).toBe(201);

      const secondResponse = await request(app)
        .post(route)
        .send(body)
        .expect(200);
      const secondApplicationResponse =
        secondResponse.body as ApplicationResponseTypes.Body<
          undefined,
          UniversalError
        >;

      expect(secondApplicationResponse.status).toBe(400);
      expect(secondApplicationResponse.code).toBe('BAD_ENTITY_ERROR');
    });
  });
});
