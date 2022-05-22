import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Ticket from '../../../db/models/ticket';
import { DbModelTypes } from '../../../types/db/models';
import TicketUpdatedPublisher from '../publishers/ticket-updated-publisher';

class OrderCancelledListener extends objects.nats
  .Listener<NatsTypes.OrderCancelledEvent> {
  readonly subject = 'order:cancelled';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-order-cancelled`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.OrderCancelledEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.OrderCancelledEventData
  ): Promise<
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | InstanceType<typeof objects.errors.NatsError>
    | undefined
  > {
    console.log(
      `[tickets] NATS client ${process.env.NATS_CLIENT_ID} received event from order:cancelled channel.`
    );

    const {
      id: orderId,
      ticket: { id: ticketId },
    } = data;

    const [ticket, findTicketError] = await db.helpers.findOne<
      DbModelTypes.TicketDocument,
      DbModelTypes.TicketModel
    >({
      Model: Ticket,
      filters: {
        _id: ticketId,
        orderId,
      },
      errorMessage: `There was an error finding ticket with ID ${ticketId}.`,
    });
    if (findTicketError) return findTicketError;
    if (!ticket)
      return new objects.errors.EntityNotFoundError(
        'ticket',
        `Ticket with ID ${ticketId} was not found in the database.`
      );

    ticket.orderId = undefined;

    const [updatedTicket, updateTicketError] =
      await db.helpers.save<DbModelTypes.TicketDocument>({
        document: ticket,
        errorMessage: `There was an error un-reserving ticket with ID ${ticketId}.`,
      });
    if (updateTicketError) return updateTicketError;

    const natsError = await new TicketUpdatedPublisher(this.client).publish({
      id: updatedTicket.id,
      title: updatedTicket.title,
      price: updatedTicket.price,
      userId: updatedTicket.userId,
      version: updatedTicket.version,
    });
    if (natsError) return natsError;

    return undefined;
  }
}

export default OrderCancelledListener;
