import { ApplicationResponseTypes, objects } from '@msnr-ticketing-app/common';
import request from 'supertest';
import app from '../../../../src/app';
import cookies from '../../../lib/cookies';

const route = '/tickets';

describe('Tests for the POST /tickets endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /tickets for POST requests.', async () => {
      const response = await request(app).post(route).send({}).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;
      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });

    it('Should not return a 401 status if the user performs an authenticated request.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();
      const response = await request(app)
        .post(route)
        .set('Cookie', cookie)
        .send({})
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;
      expect(applicationResponse.status).not.toBe(401);
      expect(applicationResponse.code).not.toBe('UNAUTHORIZED_ERROR');
    });

    it('Should persist a new ticket if all parameters are valid.', async () => {});
  });

  describe('Handler logic errors', () => {
    it('Should deny access if user is not signed in.', async () => {
      const response = await request(app).post(route).send({}).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;
      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });

    it('Should return a request validation error if an invalid title is provided.', async () => {
      const body = {
        data: {
          newTicket: {
            title: '',
            price: 10,
          },
        },
      };

      const [, cookie] = cookies.helpers.createUserAndCookie();
      const response = await request(app)
        .post(route)
        .set('Cookie', cookie)
        .send(body)
        .expect(200);

      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('REQUEST_VALIDATION_ERROR');
    });

    it('Should return a request validation error if an invalid price is provided.', async () => {
      const body = {
        data: {
          newTicket: {
            title: 'Super cool event',
            price: -50,
          },
        },
      };

      const [, cookie] = cookies.helpers.createUserAndCookie();
      const response = await request(app)
        .post(route)
        .set('Cookie', cookie)
        .send(body)
        .expect(200);

      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('REQUEST_VALIDATION_ERROR');
    });
  });
});
