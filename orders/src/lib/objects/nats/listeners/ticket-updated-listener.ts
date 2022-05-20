import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Ticket from '../../../db/models/ticket';
import { DbModelTypes } from '../../../types/db/models';

class TicketUpdatedListener extends objects.nats
  .Listener<NatsTypes.TicketUpdatedEvent> {
  readonly subject = 'ticket:updated';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-ticket-updated`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  onMessage(msg: Message, data: NatsTypes.TicketUpdatedEventData): void {
    this.exec(msg, data).then((err) => {
      if (!err) msg.ack();
    });
  }

  private async exec(
    msg: Message,
    data: NatsTypes.TicketUpdatedEventData
  ): Promise<
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | undefined
  > {
    console.log(
      `[orders] NATS client ${process.env.NATS_CLIENT_ID} received event from ticket:updated channel.`
    );

    const { id, title, price, version } = data;

    const [ticket, findTicketError] = await db.helpers.findOne<
      DbModelTypes.TicketDocument,
      DbModelTypes.TicketModel
    >({
      Model: Ticket,
      filters: {
        _id: id,
        version: version - 1,
      },
      errorMessage: `There was an error finding ticket with ID ${id}.`,
    });
    if (findTicketError) return findTicketError;
    if (!ticket)
      return new objects.errors.EntityNotFoundError(
        'ticket',
        `Ticket with ID ${id} not found in the orders database.`
      );

    ticket!.title = title;
    ticket!.price = price;

    const [, updateTicketError] =
      await db.helpers.save<DbModelTypes.TicketDocument>({
        document: ticket!,
        errorMessage: `There was an error updating ticket with ID ${id} into the database.`,
      });

    if (updateTicketError) return updateTicketError;
    return undefined;
  }
}

export default TicketUpdatedListener;
