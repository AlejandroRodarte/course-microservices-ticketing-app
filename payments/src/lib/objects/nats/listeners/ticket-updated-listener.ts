import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import dbHelpers from '../../../db/helpers';
import { DbModelTypes } from '../../../types/db/models';

class TicketUpdatedListener extends objects.nats
  .Listener<NatsTypes.TicketUpdatedEvent> {
  readonly subject = 'ticket:updated';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-ticket-updated`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.TicketUpdatedEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
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
      `[payments] NATS client ${process.env.NATS_CLIENT_ID} received event from ticket:updated channel.`
    );

    const { id, orderId, version } = data;

    const [ticket, findTicketError] = await dbHelpers.tickets.findByEvent({
      id,
      version,
      errorMessage: `There was an error finding ticket with ID ${id}.`,
    });
    if (findTicketError) return findTicketError;
    if (!ticket)
      return new objects.errors.EntityNotFoundError(
        'ticket',
        `Ticket with ID ${id} not found in the orders database.`
      );

    ticket!.orderId = orderId;

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
