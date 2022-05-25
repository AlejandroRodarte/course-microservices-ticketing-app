import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import OrderCreatedListener from '../../../../../src/lib/objects/nats/listeners/order-created-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import Order from '../../../../../src/lib/db/models/order';

describe('Tests for the OrderCreatedListener object.', () => {
  describe('Success cases', () => {
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

    it('Should save replicated order data into the database.', async () => {
      const { listener, data, msg } = setup();
      await listener.onMessage(msg, data);

      const order = await Order.findById(data.id);

      expect(order).not.toBeNull();
      expect(order?.id).toBe(data.id);
      expect(order?.status).toBe(data.status);
      expect(order?.userId).toBe(data.userId);
      expect(order?.version).toBe(data.version);
      expect(order?.price).toBe(data.ticket.price);
    });

    it('Should acknowledge message after saving the order.', async () => {
      const { listener, data, msg } = setup();
      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });
});
