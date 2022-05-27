import { db, NatsTypes, objects } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import { QUEUE_GROUP_NAME } from '../../../constants/nats';
import Order from '../../../db/models/order';
import { DbModelTypes } from '../../../types/db/models';
import OrderCompletedPublisher from '../publishers/order-completed-publisher';

class PaymentCreatedListener extends objects.nats
  .Listener<NatsTypes.PaymentCreatedEvent> {
  readonly subject = 'payment:created';
  readonly ackWait = 5 * 1000;
  readonly durableName = `${QUEUE_GROUP_NAME}-payment-created`;
  readonly queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(
    msg: Message,
    data: NatsTypes.PaymentCreatedEventData
  ): Promise<void> {
    const error = await this.exec(msg, data);
    if (!error) msg.ack();
  }

  private async exec(
    msg: Message,
    data: NatsTypes.PaymentCreatedEventData
  ): Promise<
    | InstanceType<typeof objects.errors.DatabaseOperationError>
    | InstanceType<typeof objects.errors.EntityNotFoundError>
    | InstanceType<typeof objects.errors.NatsError>
    | undefined
  > {
    const {
      order: { id: orderId },
    } = data;

    const [order, findOrderError] = await db.helpers.findById<
      DbModelTypes.OrderDocument,
      DbModelTypes.OrderModel
    >({
      Model: Order,
      id: orderId,
      errorMessage: `There was an error finding order with ID ${orderId}.`,
    });
    if (findOrderError) return findOrderError;
    if (!order)
      return new objects.errors.EntityNotFoundError(
        'order',
        `Order with ID ${orderId} was not found in the database.`
      );

    order.status = 'complete';

    const [, updateOrderError] =
      await db.helpers.save<DbModelTypes.OrderDocument>({
        document: order,
        errorMessage: `There was an error marking order with ID ${orderId} as complete.`,
      });
    if (updateOrderError) return updateOrderError;

    const natsError = await new OrderCompletedPublisher(this.client).publish({
      id: order.id,
      version: order.version,
    });
    if (natsError) return natsError;

    return undefined;
  }
}

export default PaymentCreatedListener;
