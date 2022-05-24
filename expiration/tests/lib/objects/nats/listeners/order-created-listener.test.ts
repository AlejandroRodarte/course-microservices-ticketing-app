import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import OrderCreatedListener from '../../../../../src/lib/objects/nats/listeners/order-created-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import expirationQueue from '../../../../../src/lib/bull/queues/expiration-queue';

describe('Tests for the OrderCreatedListener object.', () => {
  const setup = () => {
    const [stan] = stanSingleton.stan;
    const listener = new OrderCreatedListener(stan!);

    const data: NatsTypes.OrderCreatedEventData = {
      id: new mongoose.Types.ObjectId().toHexString(),
      status: 'created',
      userId: new mongoose.Types.ObjectId().toHexString(),
      expiresAt: new Date().toISOString(),
      version: 0,
      ticket: {
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
      },
    };

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, data, msg };
  };

  describe('Success cases', () => {
    it('Should add order:expiration job to queue.', async () => {
      const { listener, data, msg } = setup();
      await listener.onMessage(msg, data);
      expect(expirationQueue.add).toHaveBeenCalledWith(
        { orderId: data.id },
        { delay: expect.any(Number) }
      );
    });

    it('Should acknowledge the message after queueing the order:expiration job.', async () => {
      const { listener, data, msg } = setup();
      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });
});
