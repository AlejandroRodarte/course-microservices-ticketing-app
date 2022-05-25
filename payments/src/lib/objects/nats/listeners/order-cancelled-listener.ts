import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import dbHelpers from '../../../db/helpers';
import { DbModelTypes } from '../../../types/db/models';

class OrderCancelledListener extends objects.nats
  .Listener<NatsTypes.OrderCancelledEvent> {
  readonly subject = 'order:cancelled';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-order-cancelled`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.OrderCancelledEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.OrderCancelledEventData
  ): Promise<
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | undefined
  > {
    console.log(
      `[payments] NATS client ${process.env.NATS_CLIENT_ID} received event from order:cancelled channel.`
    );

    const { id, version } = data;

    const [order, findOrderError] = await dbHelpers.orders.findByEvent({
      id,
      version,
      errorMessage: `There was an error finding previous version of order with ID ${id}.`,
    });
    if (findOrderError) return findOrderError;
    if (!order)
      return new objects.errors.EntityNotFoundError(
        'order',
        `Previous version of order with ID ${id} not found.`
      );

    order!.status = 'cancelled';

    const [, updateOrderError] =
      await db.helpers.save<DbModelTypes.OrderDocument>({
        document: order!,
        errorMessage: `There was a problem cancelling order with ID ${order.id}.`,
      });
    if (updateOrderError) return updateOrderError;

    return undefined;
  }
}

export default OrderCancelledListener;
