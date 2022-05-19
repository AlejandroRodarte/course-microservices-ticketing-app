import { constants, db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Order from '../../../lib/db/models/order';
import Ticket from '../../../lib/db/models/ticket';
import { DbModelTypes } from '../../../lib/types/db/models';
import { OrdersRequestHandlers } from '../../../lib/types/request-handlers/orders';

const post = async (
  req: OrdersRequestHandlers.PostOrdersExtendedRequest,
  res: Response
) => {
  // 1. find ticket user is trying to order in database
  const { ticketId } = req.body.data.newOrder;
  const [ticket, findOneTicketError] = await db.helpers.findById<
    DbModelTypes.TicketDocument,
    DbModelTypes.TicketModel
  >({
    Model: Ticket,
    id: ticketId,
    errorMessage: `There was an error finding ticket with ID ${ticketId}.`,
  });

  if (findOneTicketError) throw findOneTicketError;
  if (!ticket)
    throw new objects.errors.EntityNotFoundError(
      'ticket',
      `Ticket with ID ${ticketId} was not found in the database.`
    );

  // 2. make sure that the ticket is not already reserved
  // 2a. find order that has ticket we just found as that is not reserved (non-cancelled status)
  const [existingOrder, findOneExistingOrderError] = await db.helpers.findOne<
    DbModelTypes.OrderDocument,
    DbModelTypes.OrderModel
  >({
    Model: Order,
    filters: {
      ticket,
      status: {
        $in: constants.resources.order.statuses.filter(
          (status) => status !== 'cancelled'
        ),
      },
    },
    errorMessage: `Error finding order that matches ticket ID ${ticket._id} and that is not cancelled.`,
  });

  if (findOneExistingOrderError) throw findOneExistingOrderError;
  // 2b. if a non-cancelled order is found for the ticket, it means that the ticket has been reserver
  if (existingOrder)
    throw new objects.errors.BadEntityError(
      'order',
      `There is already an order reserving ticket with ID ${ticket._id}`
    );

  // 3. calculate an expiration date for this order
  // 4. build the order and save it to the database
  // 5. publish event informing an order has been created

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        200,
        'ROUTE_FOUND',
        'Route POST /orders found.',
        undefined,
        undefined
      )
    );
};

export default post;
