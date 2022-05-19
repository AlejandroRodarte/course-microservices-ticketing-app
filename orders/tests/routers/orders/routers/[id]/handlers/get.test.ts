import { ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../../../src/app';
import cookies from '../../../../../lib/cookies';
import CreateOrderData from '../../../../../../src/lib/objects/data/orders/create-order-data';

const routes = {
  newOrder: '/orders',
  getOrder: {
    withId: (id: string) => `/orders/${id}`,
    withoutId: () => `/orders/${new mongoose.Types.ObjectId().toHexString()}`,
  },
};

describe('Test for the GET /orders/:id endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /orders/:id for GET requests.', async () => {
      const response = await request(app)
        .get(routes.getOrder.withoutId())
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;

      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });
  });
});
