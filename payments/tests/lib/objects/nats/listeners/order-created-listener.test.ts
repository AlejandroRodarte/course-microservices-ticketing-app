import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import OrderCreatedListener from '../../../../../src/lib/objects/nats/listeners/order-created-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import Order from '../../../../../src/lib/db/models/order';
import Ticket from '../../../../../src/lib/db/models/ticket';

describe('Tests for the OrderCreatedListener object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new OrderCreatedListener(stan!);

    const orderId = new mongoose.Types.ObjectId().toHexString();

    const savedTicket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      orderId,
    });

    const eventsData: NatsTypes.OrderCreatedEventData[] = [
      {
        id: orderId,
        status: 'created',
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
          id: savedTicket.id,
          price: 20,
        },
      },
      {
        id: orderId,
        status: 'created',
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        version: 0,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
          price: 20,
        },
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, eventsData, msg };
  };

  describe('Success cases', () => {
    it('Should save replicated order data into the database.', async () => {
      const { listener, savedTicket, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(data.id).populate('ticket');

      expect(order).not.toBeNull();
      expect(order?.id).toBe(data.id);
      expect(order?.status).toBe(data.status);
      expect(order?.userId).toBe(data.userId);
      expect(order?.version).toBe(data.version);
      expect(order?.price).toBe(data.ticket.price);
      expect(order?.ticket.id).toBe(savedTicket.id);
    });

    it('Should acknowledge message after saving the order.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', async () => {
    it('Should not create order if ticket is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(data.id);
      expect(order).toBeNull();
    });

    it('Should not acknowledge message if ticket is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
