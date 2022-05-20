import { NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { DURABLE_NAME, QUEUE_GROUP_NAME } from '../../../constants/nats';

class TicketUpdatedListener extends objects.nats
  .Listener<NatsTypes.TicketUpdatedEvent> {
  readonly subject = 'ticket:updated';
  readonly ackWait = 5 * 1000;
  readonly durableName = DURABLE_NAME;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  onMessage(msg: Message, data: NatsTypes.TicketUpdatedEventData): void {
    throw new Error('Method not implemented.');
  }
}

export default TicketUpdatedListener;
