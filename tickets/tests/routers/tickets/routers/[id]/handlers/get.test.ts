import { ApplicationResponseTypes, objects } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../../../src/app';
import NewTicketData from '../../../../../../src/lib/objects/data/new-ticket-data';
import ShowTicketData from '../../../../../../src/lib/objects/data/show-ticket-data';
import cookies from '../../../../../lib/cookies';

const routes = {
  newTicket: '/tickets',
  getTicket: {
    withoutId: () => `/tickets/${new mongoose.Types.ObjectId().toHexString()}`,
    withId: (id: string) => `/tickets/${id}`,
  },
};

describe('Tests for the GET /tickets/:id endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /tickets/:id for GET requests.', async () => {
      const response = await request(app)
        .get(routes.getTicket.withoutId())
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });

    it('Should return a 200/TICKET_FOUND status if the ticket is found.', async () => {
      const newTicketRequestBody = {
        data: {
          newTicket: {
            title: 'Super cool event',
            price: 20,
          },
        },
      };
      const [user, cookie] = cookies.helpers.createUserAndCookie();

      const newTicketRequestResponse = await request(app)
        .post(routes.newTicket)
        .set('Cookie', cookie)
        .send(newTicketRequestBody)
        .expect(200);

      const newTicketRequestApplicationResponse =
        newTicketRequestResponse.body as ApplicationResponseTypes.Body<
          NewTicketData,
          undefined
        >;

      const response = await request(app)
        .get(
          routes.getTicket.withId(
            newTicketRequestApplicationResponse.data.newTicket.id
          )
        )
        .expect(200);

      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          ShowTicketData,
          undefined
        >;

      expect(applicationResponse.status).toBe(200);
      expect(applicationResponse.code).toBe('TICKET_FOUND');
      expect(applicationResponse.data.ticket).toEqual({
        id: newTicketRequestApplicationResponse.data.newTicket.id,
        title: newTicketRequestBody.data.newTicket.title,
        price: newTicketRequestBody.data.newTicket.price,
        userId: user.id,
        version: 0,
      });
    });
  });

  describe('Route handler errors', () => {
    it('Should return a 404/ENTITY_NOT_FOUND_ERROR error if the ticket is not found.', async () => {
      const response = await request(app)
        .get(routes.getTicket.withoutId())
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;
      expect(applicationResponse.status).toBe(404);
      expect(applicationResponse.code).toBe('ENTITY_NOT_FOUND_ERROR');
    });
  });
});
