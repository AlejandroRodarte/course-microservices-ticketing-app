import { ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import request from 'supertest';
import app from '../../../../src/app';
import cookies from '../../../lib/cookies';

const routes = {
  newOrder: '/orders',
  getOrders: '/orders',
};

describe('Test for the GET /orders endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /orders for GET requests.', async () => {
      const response = await request(app).get(routes.getOrders).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;

      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });
  });
});
