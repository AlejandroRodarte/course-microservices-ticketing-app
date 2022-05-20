import { NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';

class TicketCreatedListener extends objects.nats
  .Listener<NatsTypes.TicketCreatedEvent> {
  readonly subject = 'ticket:created';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-ticket-created`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  onMessage(msg: Message, data: NatsTypes.TicketCreatedEventData): void {
    throw new Error('Method not implemented.');
  }
}

export default TicketCreatedListener;
