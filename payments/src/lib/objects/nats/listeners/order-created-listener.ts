import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Order from '../../../db/models/order';
import { DbModelTypes } from '../../../types/db/models';

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
    InstanceType<typeof objects.errors.DatabaseOperationError> | undefined
  > {
    console.log(
      `[payments] NATS client ${process.env.NATS_CLIENT_ID} received event from order:created channel.`
    );

    const {
      id,
      status,
      userId,
      version,
      ticket: { price: ticketPrice },
    } = data;

    const order = Order.build({
      id,
      status,
      userId,
      version,
      price: ticketPrice,
    });

    const [, saveOrderError] =
      await db.helpers.save<DbModelTypes.OrderDocument>({
        document: order,
        errorMessage: 'There was an error saving the order into the database.',
      });
    if (saveOrderError) return saveOrderError;

    return undefined;
  }
}

export default OrderCreatedListener;
