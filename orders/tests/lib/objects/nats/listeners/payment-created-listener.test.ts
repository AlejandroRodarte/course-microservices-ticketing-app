import { NatsTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Order from '../../../../../src/lib/db/models/order';
import Ticket from '../../../../../src/lib/db/models/ticket';
import PaymentCreatedListener from '../../../../../src/lib/objects/nats/listeners/payment-created-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';

describe('Tests for the PaymentCreatedListener object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new PaymentCreatedListener(stan!);

    const savedTicket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Concert',
      price: 20,
    });
    await savedTicket.save();

    const savedOrder = Order.build({
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: 'created',
      expiresAt: new Date(),
      ticket: savedTicket,
    });
    await savedOrder.save();

    const eventsData: NatsTypes.PaymentCreatedEventData[] = [
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'cool-stripe-charge-id',
        order: {
          id: savedOrder.id,
        },
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        stripeId: 'cool-stripe-charge-id',
        order: {
          id: new mongoose.Types.ObjectId().toHexString(),
        },
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, savedOrder, eventsData, msg };
  };

  describe('Success cases', () => {
    it('Should mark order as completed upon event arrival.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(savedOrder.id);
      expect(order!.status).toBe('complete');
    });

    it('Should emit to order:completed after marking order as completed.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);
      const order = await Order.findById(savedOrder.id);

      const [stan] = stanSingleton.stan;
      expect(stan?.publish).toHaveBeenCalledWith(
        'order:completed',
        JSON.stringify({
          id: order!.id,
          version: order!.version,
        }),
        expect.any(Function)
      );
    });

    it('Should acknowledge message after marking event as completed.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not acknowledge the message if order is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
