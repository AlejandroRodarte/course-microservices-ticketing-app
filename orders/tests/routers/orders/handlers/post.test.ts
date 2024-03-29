import { ApplicationResponseTypes, objects } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../src/app';
import cookies from '../../../lib/cookies';
import CreateOrderData from '../../../../src/lib/objects/data/orders/create-order-data';
import { DbModelTypes } from '../../../../src/lib/types/db/models';
import Ticket from '../../../../src/lib/db/models/ticket';
import Order from '../../../../src/lib/db/models/order';
import stanSingleton from '../../../../src/lib/objects/nats/stan-singleton';

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

    it('Should return a 201/ORDER_CREATED status and emit an order:created event if the order is succesfully created', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      // creating a ticket
      const ticketAttributes: DbModelTypes.TicketAttributes = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
      };
      const ticket = Ticket.build(ticketAttributes);
      await ticket.save();

      const body = {
        data: {
          newOrder: {
            ticketId: ticket._id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newOrder)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          CreateOrderData,
          undefined
        >;

      expect(applicationResponse.status).toBe(201);
      expect(applicationResponse.code).toBe('ORDER_CREATED');

      expect(applicationResponse.data.newOrder.userId).toBe(user.id);

      const [stan] = stanSingleton.stan;
      expect(stan?.publish).toHaveBeenCalled();
    });
  });

  describe('Route handler errors', () => {
    it('Should return a 401/UNAUTHORIZED_ERROR status if the request has no credentials.', async () => {
      const body = {
        data: {
          newOrder: {
            ticketId: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      };

      const response = await request(app)
        .post(routes.newOrder)
        .send(body)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });

    it('Should return a 422/VALIDATION_ERROR status if no ticketId is provided in the request body.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();
      const body = {
        data: {
          newOrder: {},
        },
      };

      const response = await request(app)
        .post(routes.newOrder)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');
    });

    it('Should return a 422/VALIDATION_ERROR status the ticketId does not match MongoDB standard.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();
      const body = {
        data: {
          newOrder: {
            ticketId: '123abc',
          },
        },
      };

      const response = await request(app)
        .post(routes.newOrder)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');

      const ticketIdError = applicationResponse.error.errors.find(
        (error) => error.field === 'data.newOrder.ticketId'
      );
      expect(ticketIdError!.message).toBe(
        'A ticket ID should be supplied and match a MongoDB ObjectID structure.'
      );
    });

    it('Should return a 404/ENTITY_NOT_FOUND_ERROR status if the ticket is not found in the database.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();
      const body = {
        data: {
          newOrder: {
            ticketId: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      };

      const response = await request(app)
        .post(routes.newOrder)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(404);
      expect(applicationResponse.code).toBe('ENTITY_NOT_FOUND_ERROR');

      const [error] = applicationResponse.error.errors;
      expect(error.field).toBe('ticket');
    });

    it('Should return a 400/BAD_ENTITY_ERROR status if the ticket is already reserved.', async () => {
      const [firstUser] = cookies.helpers.createUserAndCookie();
      const [, secondUserCookie] = cookies.helpers.createUserAndCookie();

      // creating a ticket
      const ticketAttributes: DbModelTypes.TicketAttributes = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
      };
      const ticket = Ticket.build(ticketAttributes);
      await ticket.save();

      // creating an order
      const orderAttributesExpiresAt = new Date();
      orderAttributesExpiresAt.setSeconds(
        orderAttributesExpiresAt.getSeconds() + 900
      );
      const orderAttributes: DbModelTypes.OrderAttributes = {
        userId: firstUser.id,
        status: 'created',
        expiresAt: orderAttributesExpiresAt,
        ticket,
      };
      const order = Order.build(orderAttributes);
      await order.save();

      const body = {
        data: {
          newOrder: {
            ticketId: ticket._id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newOrder)
        .send(body)
        .set('Cookie', secondUserCookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(400);
      expect(applicationResponse.code).toBe('BAD_ENTITY_ERROR');

      const [error] = applicationResponse.error.errors;
      expect(error.field).toBe('order');
    });
  });
});
