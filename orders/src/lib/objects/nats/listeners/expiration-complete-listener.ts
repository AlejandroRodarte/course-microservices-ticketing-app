import {
  db,
  NatsTypes,
  objects,
  OrderResourceTypes,
} from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Order from '../../../db/models/order';
import { DbModelTypes } from '../../../types/db/models';
import OrderCancelledPublisher from '../publishers/order-cancelled-publisher';

class ExpirationCompleteListener extends objects.nats
  .Listener<NatsTypes.ExpirationCompleteEvent> {
  readonly subject = 'expiration:complete';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-expiration-complete`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.ExpirationCompleteEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.ExpirationCompleteEventData
  ): Promise<
    | InstanceType<typeof objects.errors.NatsError>
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | undefined
  > {
    console.log(
      `[orders] NATS client ${process.env.NATS_CLIENT_ID} received event from expiration:complete channel.`
    );

    const {
      order: { id: orderId },
    } = data;

    const [order, findOrderError] = await db.helpers.findById<
      DbModelTypes.OrderDocument,
      DbModelTypes.OrderModel
    >({
      Model: Order,
      id: orderId,
      errorMessage: `There was a problem finding order with ID ${orderId}.`,
      opts: {
        populateFields: ['ticket'],
      },
    });
    if (findOrderError) return findOrderError;
    if (!order)
      return new objects.errors.EntityNotFoundError(
        'order',
        `Order with ID ${orderId} was not found in the database.`
      );

    const cancellableStatuses: OrderResourceTypes.Status[] = [
      'awaiting:payment',
      'created',
    ];

    if (!cancellableStatuses.includes(order.status)) return undefined;

    order.status = 'cancelled';
    const [updatedOrder, updateOrderError] =
      await db.helpers.save<DbModelTypes.OrderDocument>({
        document: order,
        errorMessage: `There was an error cancelling order with ID ${orderId}.`,
      });
    if (updateOrderError) return updateOrderError;

    console.log(
      `[orders] NATS client ${process.env.NATS_CLIENT_ID} emitting event to order:cancelled channel.`
    );

    const natsError = await new OrderCancelledPublisher(this.client).publish({
      id: updatedOrder!.id,
      version: updatedOrder!.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    if (natsError) return natsError;
  }
}

export default ExpirationCompleteListener;
