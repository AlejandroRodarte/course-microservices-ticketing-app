import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Ticket from '../../../db/models/ticket';
import { DbModelTypes } from '../../../types/db/models';

class TicketCreatedListener extends objects.nats
  .Listener<NatsTypes.TicketCreatedEvent> {
  readonly subject = 'ticket:created';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-ticket-created`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  onMessage(msg: Message, data: NatsTypes.TicketCreatedEventData): void {
    this.exec(msg, data).then((err) => {
      if (!err) msg.ack();
    });
  }

  private async exec(
    msg: Message,
    data: NatsTypes.TicketCreatedEventData
  ): Promise<
    InstanceType<typeof objects.errors.DatabaseOperationError> | undefined
  > {
    const { title, price } = data;
    const ticket = Ticket.build({ title, price });
    const [, saveTicketError] =
      await db.helpers.save<DbModelTypes.TicketDocument>({
        document: ticket,
        errorMessage: 'There was an error saving the ticket into the database.',
      });
    if (saveTicketError) return saveTicketError;
    return undefined;
  }
}

export default TicketCreatedListener;
