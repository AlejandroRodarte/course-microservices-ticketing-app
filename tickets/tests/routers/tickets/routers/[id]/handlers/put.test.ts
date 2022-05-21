import { ApplicationResponseTypes, objects } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../../../../../src/app';
import NewTicketData from '../../../../../../src/lib/objects/data/new-ticket-data';
import UpdateTicketData from '../../../../../../src/lib/objects/data/update-ticket-data';
import cookies from '../../../../../lib/cookies';
import stanSingleton from '../../../../../../src/lib/objects/nats/stan-singleton';

const routes = {
  newTicket: '/tickets',
  updateTicket: {
    withId: (id: string) => `/tickets/${id}`,
    withoutId: () => `/tickets/${new mongoose.Types.ObjectId().toHexString()}`,
  },
};

describe('Tests for the PUT /tickets/:id endpoint.', () => {
  describe('Success cases', () => {
    it('Should have a route handler listening on /tickets/:id for PUT requests.', async () => {
      const response = await request(app)
        .put(routes.updateTicket.withoutId())
        .send({})
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<undefined, undefined>;

      expect(applicationResponse.status).not.toBe(404);
      expect(applicationResponse.code).not.toBe('ROUTE_NOT_FOUND');
    });

    it('Should return a 204/TICKET_UPDATED status and publish an event to ticket:updated if the ticket is correctly updated.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const newTicketRequestBody = {
        data: {
          newTicket: {
            title: 'New event',
            price: 30,
          },
        },
      };
      const newTicketResponse = await request(app)
        .post(routes.newTicket)
        .set('Cookie', cookie)
        .send(newTicketRequestBody)
        .expect(200);
      const newTicketApplicationResponse =
        newTicketResponse.body as ApplicationResponseTypes.Body<
          NewTicketData,
          undefined
        >;

      const updateTicketRequestBody = {
        data: {
          ticketUpdates: {
            title: 'Updated event title',
            price: 50,
          },
        },
      };
      const response = await request(app)
        .put(
          routes.updateTicket.withId(
            newTicketApplicationResponse.data.newTicket.id
          )
        )
        .set('Cookie', cookie)
        .send(updateTicketRequestBody)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          UpdateTicketData,
          undefined
        >;

      expect(applicationResponse.status).toBe(204);
      expect(applicationResponse.code).toBe('TICKET_UPDATED');

      const [stan] = stanSingleton.stan;
      expect(stan!.publish).toHaveBeenCalled();

      expect(applicationResponse.data.updatedTicket).toEqual({
        id: newTicketApplicationResponse.data.newTicket.id,
        title: updateTicketRequestBody.data.ticketUpdates.title,
        price: updateTicketRequestBody.data.ticketUpdates.price,
        userId: newTicketApplicationResponse.data.newTicket.userId,
        version: 1,
      });
    });
  });

  describe('Handler logic errors', () => {
    it('Should return a 401/UNAUTHORIZED_ERROR status if the user is not authenticated.', async () => {
      const body = {
        data: {
          ticketUpdates: {
            title: 'New ticket title',
            price: 100,
          },
        },
      };

      const response = await request(app)
        .put(routes.updateTicket.withoutId())
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

    it('Should return a 401/UNAUTHORIZED_ERROR status if the user does not own the ticket.', async () => {
      const [, firstUserCookie] = cookies.helpers.createUserAndCookie();
      const newTicketRequestBody = {
        data: {
          newTicket: {
            title: 'New event',
            price: 30,
          },
        },
      };

      const newTicketResponse = await request(app)
        .post(routes.newTicket)
        .set('Cookie', firstUserCookie)
        .send(newTicketRequestBody)
        .expect(200);
      const newTicketApplicationResponse =
        newTicketResponse.body as ApplicationResponseTypes.Body<
          NewTicketData,
          undefined
        >;

      const [, secondUserCookie] = cookies.helpers.createUserAndCookie();
      const updateTicketRequestBody = {
        data: {
          ticketUpdates: {
            title: 'This is my ticket now',
            price: 100,
          },
        },
      };

      const response = await request(app)
        .put(
          routes.updateTicket.withId(
            newTicketApplicationResponse.data.newTicket.id
          )
        )
        .set('Cookie', secondUserCookie)
        .send(updateTicketRequestBody)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(401);
      expect(applicationResponse.code).toBe('UNAUTHORIZED_ERROR');

      const [errorItem] = applicationResponse.error.errors;

      expect(errorItem.message).toBe(
        `Ticket with ID ${newTicketApplicationResponse.data.newTicket.id} is not owned by this user.`
      );
    });

    it('Should return a 422/REQUEST_VALIDATION_ERROR status if the user provides an invalid title.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const newTicketRequestBody = {
        data: {
          newTicket: {
            title: 'New event',
            price: 30,
          },
        },
      };
      const newTicketResponse = await request(app)
        .post(routes.newTicket)
        .set('Cookie', cookie)
        .send(newTicketRequestBody)
        .expect(200);
      const newTicketApplicationResponse =
        newTicketResponse.body as ApplicationResponseTypes.Body<
          NewTicketData,
          undefined
        >;

      const updateTicketRequestBody = {
        data: {
          ticketUpdates: {
            title: '',
          },
        },
      };
      const response = await request(app)
        .put(
          routes.updateTicket.withId(
            newTicketApplicationResponse.data.newTicket.id
          )
        )
        .set('Cookie', cookie)
        .send(updateTicketRequestBody)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');
    });

    it('Should return a 422/REQUEST_VALIDATION_ERROR status if the user provides an invalid price.', async () => {
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const newTicketRequestBody = {
        data: {
          newTicket: {
            title: 'New event',
            price: 30,
          },
        },
      };
      const newTicketResponse = await request(app)
        .post(routes.newTicket)
        .set('Cookie', cookie)
        .send(newTicketRequestBody)
        .expect(200);
      const newTicketApplicationResponse =
        newTicketResponse.body as ApplicationResponseTypes.Body<
          NewTicketData,
          undefined
        >;

      const updateTicketRequestBody = {
        data: {
          ticketUpdates: {
            price: -30,
          },
        },
      };
      const response = await request(app)
        .put(
          routes.updateTicket.withId(
            newTicketApplicationResponse.data.newTicket.id
          )
        )
        .set('Cookie', cookie)
        .send(updateTicketRequestBody)
        .expect(200);
      const applicationResponse =
        response.body as ApplicationResponseTypes.Body<
          undefined,
          InstanceType<typeof objects.errors.UniversalError>
        >;

      expect(applicationResponse.status).toBe(422);
      expect(applicationResponse.code).toBe('VALIDATION_ERROR');
    });

    it('Should return a 404/ENTITY_NOT_FOUND_ERROR error if the ticket does not exist.', async () => {
      const body = {
        data: {
          ticketUpdates: {
            title: 'New ticket title',
            price: 100,
          },
        },
      };
      const [, cookie] = cookies.helpers.createUserAndCookie();

      const response = await request(app)
        .put(routes.updateTicket.withoutId())
        .set('Cookie', cookie)
        .send(body)
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
