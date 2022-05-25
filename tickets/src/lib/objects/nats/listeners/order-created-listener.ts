import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Ticket from '../../../db/models/ticket';
import { DbModelTypes } from '../../../types/db/models';
import TicketUpdatedPublisher from '../publishers/ticket-updated-publisher';

class OrderCreatedListener extends objects.nats
  .Listener<NatsTypes.OrderCreatedEvent> {
  readonly subject = 'order:created';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-order-created`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.OrderCreatedEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.OrderCreatedEventData
  ): Promise<
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | InstanceType<typeof objects.errors.NatsError>
    | undefined
  > {
    console.log(
      `[tickets] NATS client ${process.env.NATS_CLIENT_ID} received event from order:created channel.`
    );

    const {
      ticket: { id: ticketId },
      id: orderId,
    } = data;

    const [ticket, findTicketError] = await db.helpers.findById<
      DbModelTypes.TicketDocument,
      DbModelTypes.TicketModel
    >({
      Model: Ticket,
      id: ticketId,
      errorMessage: `There was an error finding ticket with ID ${ticketId}.`,
    });
    if (findTicketError) return findTicketError;
    if (!ticket)
      return new objects.errors.EntityNotFoundError(
        'ticket',
        `Ticket with ID ${ticketId} does not exist in the database.`
      );

    if (ticket!.orderId) return undefined;
    ticket!.orderId = orderId;

    const [updatedTicket, updateTicketError] =
      await db.helpers.save<DbModelTypes.TicketDocument>({
        document: ticket!,
        errorMessage: `There was a problem updating orderId on ticket with ID ${ticketId}.`,
      });
    if (updateTicketError) return updateTicketError;

    console.log(
      `[tickets] NATS client ${process.env.NATS_CLIENT_ID} emitting event to ticket:updated channel.`
    );
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

export default OrderCreatedListener;
