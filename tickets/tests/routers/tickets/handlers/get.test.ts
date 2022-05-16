import { ApplicationResponseTypes } from '@msnr-ticketing-app/common';
import request from 'supertest';
import app from '../../../../src/app';
import GetTicketsData from '../../../../src/lib/objects/data/get-tickets-data';
import cookies from '../../../lib/cookies';

const routes = {
  newTicket: '/tickets',
  getTickets: '/tickets',
};

describe('Tests for the GET /tickets endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /tickets for GET requests.', async () => {
      const response = await request(app).get(routes.getTickets).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;
      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });

    it('Should return a 200/TICKETS_FETCHED status upon requesting the ticket list.', async () => {
      const [user, cookie] = cookies.helpers.createUserAndCookie();
      const tickets = [
        {
          title: 'Concert',
          price: 20,
        },
        {
          title: 'Pool party',
          price: 50,
        },
        {
          title: 'Opera',
          price: 30,
        },
      ];

      for (const ticket of tickets)
        await request(app)
          .post(routes.newTicket)
          .set('Cookie', cookie)
          .send({ data: { newTicket: ticket } });

      const response = await request(app).get(routes.getTickets).expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          GetTicketsData,
          undefined
        >;

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('TICKETS_FETCHED');
      expect(
        applicationResponse.data.tickets.map((ticket) => ({
          title: ticket.title,
          price: ticket.price,
        }))
      ).toEqual(tickets);
    });
  });
});
