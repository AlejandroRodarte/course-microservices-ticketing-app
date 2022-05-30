import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import dbHelpers from '../../../db/helpers';
import { DbModelTypes } from '../../../types/db/models';

class OrderCompletedListener extends objects.nats
  .Listener<NatsTypes.OrderCompletedEvent> {
  readonly subject = 'order:completed';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-order-completed`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.OrderCompletedEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.OrderCompletedEventData
  ): Promise<
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | undefined
  > {
    console.log(
      `[payments] NATS client ${process.env.NATS_CLIENT_ID} received event from order:completed channel.`
    );

    const { id, version } = data;

    const [order, findOrderError] = await dbHelpers.orders.findByEvent({
      id,
      version,
      errorMessage: `There was an error finding ticket with ID ${id}.`,
    });
    if (findOrderError) return findOrderError;
    if (!order)
      return new objects.errors.EntityNotFoundError(
        'order',
        `Order with ID ${id} was not found in the database.`
      );

    order.status = 'complete';

    const [, updateOrderError] =
      await db.helpers.save<DbModelTypes.OrderDocument>({
        document: order,
        errorMessage: `There was a problem marking order with ID ${id} as completed.`,
      });
    if (updateOrderError) return updateOrderError;

    return undefined;
  }
}

export default OrderCompletedListener;
