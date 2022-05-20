import { ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../src/app';
import cookies from '../../../lib/cookies';
import Ticket from '../../../../src/lib/db/models/ticket';
import { DbModelTypes } from '../../../../src/lib/types/db/models';
import GetOrdersData from '../../../../src/lib/objects/data/orders/get-orders-data';

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

    it('Should return a 200/USER_ORDERS_FETCHED', async () => {
      const [, firstUserCookie] = cookies.helpers.createUserAndCookie();
      const [secondUser, secondUserCookie] =
        cookies.helpers.createUserAndCookie();

      // 1. create three tickets
      const ticketAttributes: DbModelTypes.TicketAttributes[] = [
        {
          id: new mongoose.Types.ObjectId().toHexString(),
          title: 'Concert',
          price: 20,
        },
        {
          id: new mongoose.Types.ObjectId().toHexString(),
          title: 'Art Gallery',
          price: 50,
        },
        {
          id: new mongoose.Types.ObjectId().toHexString(),
          title: 'Monster Jam',
          price: 35,
        },
      ];

      const tickets: DbModelTypes.TicketDocument[] = [];

      for (const ticketAttribute of ticketAttributes) {
        const ticket = Ticket.build(ticketAttribute);
        const savedTicket = await ticket.save();
        tickets.push(savedTicket);
      }

      // 2. create one order as user 1
      await request(app)
        .post(routes.newOrder)
        .send({ data: { newOrder: { ticketId: tickets[0]._id } } })
        .set('Cookie', firstUserCookie)
        .expect(200);

      // 3. create two orders as user 2
      await request(app)
        .post(routes.newOrder)
        .send({ data: { newOrder: { ticketId: tickets[1]._id } } })
        .set('Cookie', secondUserCookie)
        .expect(200);
      await request(app)
        .post(routes.newOrder)
        .send({ data: { newOrder: { ticketId: tickets[2]._id } } })
        .set('Cookie', secondUserCookie)
        .expect(200);

      // 4. query orders for user 2
      const response = await request(app)
        .get(routes.getOrders)
        .set('Cookie', secondUserCookie)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          GetOrdersData,
          undefined
        >;

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('USER_ORDERS_FETCHED');

      const userIds = applicationResponse.data.orders.map(
        (order) => order.userId
      );
      for (const userId of userIds) expect(userId).toBe(secondUser.id);

      const [firstOrder, secondOrder] = applicationResponse.data.orders;
      expect(firstOrder.ticket.id).toBe(tickets[1].id);
      expect(secondOrder.ticket.id).toBe(tickets[2].id);
    });
  });
});
