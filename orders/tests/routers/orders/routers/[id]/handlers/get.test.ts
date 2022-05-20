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

    it('Should return a 200/USER_ORDER_FETCHED status if the user order is found.', async () => {});
  });

  describe('Route handler errors', () => {
    it('Should throw a 401/UNAUTHORIZED_ERROR status if no credentials are provided.', async () => {});

    it('Should throw a 404/ENTITY_NOT_FOUND_ERROR status if no order is found in the database.', async () => {});

    it('Should throw a 401/UNAUTHORIZED_ERROR status with the correct reason if the order is not owned by the user.', async () => {});
  });
});
