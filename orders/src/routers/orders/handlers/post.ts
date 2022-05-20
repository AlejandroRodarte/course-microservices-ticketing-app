import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Order from '../../../lib/db/models/order';
import Ticket from '../../../lib/db/models/ticket';
import CreateOrderData from '../../../lib/objects/data/orders/create-order-data';
import BaseOrderDto from '../../../lib/objects/dto/orders/base-order-dto';
import OrderCreatedPublisher from '../../../lib/objects/nats/publishers/order-created-publisher';
import stanSingleton from '../../../lib/objects/nats/stan-singleton';
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
  const [isTicketReserved, ticketReservedError] = await ticket.isReserved();
  if (ticketReservedError) throw ticketReservedError;
  // 2b. if a non-cancelled order is found for the ticket, it means that the ticket has been reserved
  if (isTicketReserved)
    throw new objects.errors.BadEntityError(
      'order',
      `There is already an order reserving ticket with ID ${ticket._id}`
    );

  // 3. calculate an expiration date for this order
  const expiresAt = new Date();
  expiresAt.setSeconds(
    expiresAt.getSeconds() + parseInt(process.env.EXPIRATION_WINDOW_SECONDS!)
  );

  // 4. build the order and save it to the database
  const order = Order.build({
    userId: req['jwt/user-data']!.id,
    status: 'created',
    expiresAt,
    ticket,
  });

  const [savedOrder, saveOrderError] =
    await db.helpers.save<DbModelTypes.OrderDocument>({
      document: order,
      errorMessage: 'Error saving order into the database.',
    });

  if (saveOrderError) throw saveOrderError;

  // 5. publish event informing an order has been created
  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) throw stanUnconnectedError;

  console.log(
    `[orders] NATS client ${process.env.NATS_CLIENT_ID} emitting event to order:created channel.`
  );
  const natsError = await new OrderCreatedPublisher(stan!).publish({
    id: savedOrder.id,
    status: savedOrder.status,
    userId: savedOrder.userId,
    expiresAt: savedOrder.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  });

  if (natsError) throw natsError;

  // 6. send back response to client
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<CreateOrderData, undefined>(
        201,
        'ORDER_CREATED',
        `Order ${
          savedOrder!.id
        } has been succesfully persisted into the database.`,
        new CreateOrderData(BaseOrderDto.fromOrderDocument(savedOrder!)),
        undefined
      )
    );
};

export default post;
