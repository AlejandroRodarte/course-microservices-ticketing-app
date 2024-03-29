import { ApplicationResponseTypes, objects } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../src/app';
import cookies from '../../../lib/cookies';
import { DbModelTypes } from '../../../../src/lib/types/db/models';
import Ticket from '../../../../src/lib/db/models/ticket';
import Order from '../../../../src/lib/db/models/order';
import stanSingleton from '../../../../src/lib/objects/nats/stan-singleton';
import stripe from '../../../../src/lib/stripe/instance';
import NewPaymentData from '../../../../src/lib/objects/data/new-payment-data';
import Payment from '../../../../src/lib/db/models/payment';

const routes = {
  newCharge: '/payments',
};

describe('Tests for the POST /payments endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /payments for POST requests.', async () => {
      const response = await request(app).post(routes.newCharge).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<unknown, unknown>;
      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });

    it('Should expect a 201/CHARGE_CREATED status and call stripe.charged.create with the right arguments upon request arrival.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: ticket.orderId!,
        status: 'created',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'tok_visa',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          NewPaymentData,
          undefined
        >;

      expect(applicationResponse.status).toBe(201);
      expect(applicationResponse.code).toBe('CHARGE_CREATED');

      expect(stripe.charges.create).toHaveBeenCalledWith(
        {
          currency: 'usd',
          amount: order.price * 100,
          source: body.data.newCharge.token,
        },
        undefined
      );
    });

    it('Should create payment record upon request arrival.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: ticket.orderId!,
        status: 'created',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'tok_visa',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          NewPaymentData,
          undefined
        >;

      expect(applicationResponse.data.newPayment.orderId).toBe(order.id);
      expect(applicationResponse.data.newPayment.stripeId).toBeDefined();

      const payment = await Payment.findById(
        applicationResponse.data.newPayment.id
      );

      expect(payment!.orderId).toBe(order.id);
      expect(payment!.stripeId).toBeDefined();
    });

    it('Should publish to payment:created channel upon request arrival.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: ticket.orderId!,
        status: 'created',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'tok_visa',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          NewPaymentData,
          undefined
        >;

      const [stan] = stanSingleton.stan;
      expect(stan?.publish).toHaveBeenCalledWith(
        'payment:created',
        JSON.stringify({
          id: applicationResponse.data.newPayment.id,
          stripeId: 'some-cool-stripe-charge-id',
          order: {
            id: order.id,
          },
        }),
        expect.any(Function)
      );
    });
  });

  describe('Failure cases', () => {
    it('Should return a 401/UNAUTHORIZED_ERROR status is no user credentials are provided.', async () => {
      const response = await request(app).post(routes.newCharge).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');
    });

    it('Should return a 422/VALIDATION_ERROR status if no stripe token is provided in the body.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const body = {
        data: {
          newCharge: {
            orderId: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');
    });

    it('Should return a 422/VALIDATION_ERROR status if no orderId is provided in the request body.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');
    });

    it('Should return a 422/VALIDATION_ERROR status if a non-mongoDB id is provided in the request body.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: 'not-a-mongodb-id',
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');
    });

    it('Should return a 404/ENTITY_NOT_FOUND_ERROR status if no order exists in the database.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: new mongoose.Types.ObjectId().toHexString(),
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(404);
      expect(applicationResponse.code).toBe('ENTITY_NOT_FOUND_ERROR');

      const [error] = applicationResponse.error.errors;
      expect(error.field).toBe('order');
    });

    it('Should return a 401/UNAUTHORIZED_ERROR status with the correct reason if the order is not owned by the authorized user.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: ticket.orderId!,
        status: 'created',
        version: 0,
        userId: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');

      const [error] = applicationResponse.error.errors;
      expect(error.message).toBe(
        `Order with ID ${order.id} is not owned by this user.`
      );
    });

    it('Should return a 400/BAD_ENTITY_ERROR status with the correct error message if replicated ticket is not updated with order that reserved it.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: 'created',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(400);
      expect(applicationResponse.code).toBe('BAD_ENTITY_ERROR');

      const [error] = applicationResponse.error.errors;

      expect(error.field).toBe('ticket');
      expect(error.message).toBe(
        `Ticket with ID ${ticket.id} appears to be un-reserved due to the tickets service being down. Will not accept payment for now.`
      );
    });

    it('Should return a 400/BAD_ENTITY_ERROR status with the correct reason if the user tries to pay for an order that did not reserve the ticket.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: 'created',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(400);
      expect(applicationResponse.code).toBe('BAD_ENTITY_ERROR');

      const [error] = applicationResponse.error.errors;

      expect(error.field).toBe('order');
      expect(error.message).toBe(
        `Order with ID ${order.id} did not actually reserve ticket with ID ${ticket.id}. This order will be cancelled.`
      );
    });

    it('Should emit to the payment:duplicate-order channel if the user tries to pay for an order that did not reserve the ticket.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: 'created',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: order.id,
          },
        },
      };

      await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);

      const [stan] = stanSingleton.stan;
      expect(stan!.publish).toHaveBeenCalledWith(
        'payment:duplicate-order',
        JSON.stringify({
          order: {
            id: order.id,
          },
        }),
        expect.any(Function)
      );
    });

    it('Should return a 400/BAD_ENTITY_ERROR status with the correct reason if the order is cancelled/complete.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        orderId: new mongoose.Types.ObjectId().toHexString(),
      });
      await ticket.save();

      const order = Order.build({
        id: ticket.orderId!,
        status: 'complete',
        version: 0,
        userId: user.id,
        price: 20,
        ticket,
      });
      await order.save();

      const body = {
        data: {
          newCharge: {
            token: 'super-stripe-api-token',
            orderId: order.id,
          },
        },
      };

      const response = await request(app)
        .post(routes.newCharge)
        .send(body)
        .set('Cookie', cookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          unknown,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(400);
      expect(applicationResponse.code).toBe('BAD_ENTITY_ERROR');

      const [error] = applicationResponse.error.errors;

      expect(error.field).toBe('order');
      expect(error.message).toBe(
        `Order with ID ${order.id} is ${order.status}, thus can not accept a payment.`
      );
    });
  });
});
