import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import OrderCancelledListener from '../../../../../src/lib/objects/nats/listeners/order-cancelled-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import Order from '../../../../../src/lib/db/models/order';

describe('Tests for the OrderCancelledListener object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new OrderCancelledListener(stan!);

    const savedOrder = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: 'awaiting:payment',
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 1,
      price: 20,
    });
    await savedOrder.save();

    const eventsData: NatsTypes.OrderCancelledEventData[] = [
      {
        id: savedOrder.id,
        version: savedOrder.version + 1,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
        },
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: savedOrder.version + 1,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
        },
      },
      {
        id: savedOrder.id,
        version: savedOrder.version + 2,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
        },
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedOrder, eventsData, msg };
  };

  describe('Success cases', () => {
    it('Should cancel order upon event arrival.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(savedOrder.id);
      expect(order?.status).toBe('cancelled');
    });

    it('Should acknowledge message after cancelling event.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not acknowledge message if order is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });

    it('Should not update order if previous version of order is not found.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [, , data] = eventsData;

      await listener.onMessage(msg, data);
      const order = await Order.findById(savedOrder.id);

      expect(order?.status).not.toBe('cancelled');
      expect(order?.status).toBe(savedOrder.status);
    });

    it('Should not acknowledge message if previous version of order is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, , data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
