import { ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import request from 'supertest';
import app from '../../../../src/app';
import cookies from '../../../lib/cookies';
import CreateOrderData from '../../../../src/lib/objects/data/orders/create-order-data';

const routes = {
  newOrder: '/orders',
};

describe('Test for the POST /orders endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /orders for POST requests.', async () => {
      const response = await request(app)
        .post(routes.newOrder)
        .send({})
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;

      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });
  });
});
