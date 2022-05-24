import { NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import bullHelpers from '../../../bull/helpers';
import expirationQueue from '../../../bull/queues/expiration-queue';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import { BullQueueTypes } from '../../../types/bull/queues';

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
  ): Promise<InstanceType<typeof objects.errors.LibraryError> | undefined> {
    console.log(
      `[expiration] NATS client ${process.env.NATS_CLIENT_ID} received event from order:created channel.`
    );

    const { id: orderId, expiresAt } = data;
    const delay = new Date(expiresAt).getTime() - new Date().getTime();

    const bullError =
      await bullHelpers.add<BullQueueTypes.OrderExpirationJobPayload>({
        queue: expirationQueue,
        payload: { orderId },
        opts: {
          delay,
        },
        errorMessage: `There was an error adding order:expiration job to database for order with ID ${orderId}.`,
      });
    if (bullError) return bullError;

    return undefined;
  }
}

export default OrderCreatedListener;
