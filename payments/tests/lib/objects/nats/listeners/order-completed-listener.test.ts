import { NatsTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Order from '../../../../../src/lib/db/models/order';
import Ticket from '../../../../../src/lib/db/models/ticket';
import OrderCompletedListener from '../../../../../src/lib/objects/nats/listeners/order-completed-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';

describe('Tests for the OrderCompletedEvent object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new OrderCompletedListener(stan!);

    const savedTicket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
    await savedTicket.save();

    const savedOrder = Order.build({
      id: savedTicket.orderId!,
      status: 'created',
      version: 0,
      userId: new mongoose.Types.ObjectId().toHexString(),
      price: 20,
      ticket: savedTicket,
    });
    await savedOrder.save();

    const eventsData: NatsTypes.OrderCompletedEventData[] = [
      {
        id: savedOrder.id,
        version: savedOrder.version + 1,
      },
      {
        id: savedOrder.id,
        version: savedOrder.version + 2,
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: savedOrder.version + 1,
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, savedOrder, eventsData, msg };
  };

  describe('Success cases', () => {
    it('Should mark replicated order as completed upon event arrival.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(savedOrder.id);
      expect(order!.status).toBe('complete');
    });

    it('Should acknowledge message after marking replicated order as completed.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not mark replicated order as completed if previous version of order is not found.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(savedOrder.id);

      expect(order!.status).not.toBe('complete');
      expect(order!.status).toBe(savedOrder.status);
    });

    it('Should not acknowledge message if previous version order is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });

    it('Should not acknowledge message if order is not on database.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, , data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
