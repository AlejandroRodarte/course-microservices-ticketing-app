import { ApplicationResponseTypes, objects } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../../../src/app';
import cookies from '../../../../../lib/cookies';
import CreateOrderData from '../../../../../../src/lib/objects/data/orders/create-order-data';
import { DbModelTypes } from '../../../../../../src/lib/types/db/models';
import Ticket from '../../../../../../src/lib/db/models/ticket';
import GetOrderData from '../../../../../../src/lib/objects/data/orders/get-order-data';

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

    it('Should return a 200/USER_ORDER_FETCHED status if the user order is found.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticketAttributes: DbModelTypes.TicketAttributes = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
      };
      const ticket = Ticket.build(ticketAttributes);
      const savedTicket = await ticket.save();

      const newOrderResponse = await request(app)
        .post(routes.newOrder)
        .send({ data: { newOrder: { ticketId: savedTicket.id } } })
        .set('Cookie', cookie)
        .expect(200);

      const newOrderApplicationResponse =
        newOrderResponse.body as ApplicationResponseTypes.Body<
          CreateOrderData,
          undefined
        >;

      const response = await request(app)
        .get(
          routes.getOrder.withId(newOrderApplicationResponse.data.newOrder.id)
        )
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<GetOrderData, undefined>;

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('USER_ORDER_FETCHED');

      expect(applicationResponse.data.order.id).toBe(
        newOrderApplicationResponse.data.newOrder.id
      );
      expect(applicationResponse.data.order.userId).toBe(user.id);
      expect(applicationResponse.data.order.ticket.id).toBe(savedTicket.id);
    });
  });

  describe('Route handler errors', () => {
    it('Should throw a 401/UNAUTHORIZED_ERROR status if no credentials are provided.', async () => {
      const response = await request(app)
        .get(routes.getOrder.withoutId())
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });

    it('Should throw a 404/ENTITY_NOT_FOUND_ERROR status if no order is found in the database.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const response = await request(app)
        .get(routes.getOrder.withoutId())
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(404);
      expect(applicationResponse.code).toBe('ENTITY_NOT_FOUND_ERROR');
    });

    it('Should throw a 401/UNAUTHORIZED_ERROR status with the correct reason if the order is not owned by the user.', async () => {
      const [firstUser, firstUserCookie] =
        cookies.helpers.createUserAndCookie();
      const [secondUser, secondUserCookie] =
        cookies.helpers.createUserAndCookie();

      const ticketAttributes: DbModelTypes.TicketAttributes = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
      };
      const ticket = Ticket.build(ticketAttributes);
      const savedTicket = await ticket.save();

      const newOrderResponse = await request(app)
        .post(routes.newOrder)
        .send({ data: { newOrder: { ticketId: savedTicket.id } } })
        .set('Cookie', firstUserCookie)
        .expect(200);

      const newOrderApplicationResponse =
        newOrderResponse.body as ApplicationResponseTypes.Body<
          CreateOrderData,
          undefined
        >;

      const response = await request(app)
        .get(
          routes.getOrder.withId(newOrderApplicationResponse.data.newOrder.id)
        )
        .set('Cookie', secondUserCookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');

      const [error] = applicationResponse.error.errors;
      expect(error.message).toBe(
        `Order with ID ${newOrderApplicationResponse.data.newOrder.id} is not owned by this user.`
      );
    });
  });
});
