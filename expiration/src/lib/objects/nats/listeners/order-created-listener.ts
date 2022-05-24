import { NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';

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
    await this.exec(msg, data);
    msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.OrderCreatedEventData
  ): Promise<void> {}
}

export default OrderCreatedListener;
