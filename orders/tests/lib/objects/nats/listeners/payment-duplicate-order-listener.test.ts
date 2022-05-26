import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import PaymentDuplicateOrderListener from '../../../../../src/lib/objects/nats/listeners/payment-duplicate-order-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import Ticket from '../../../../../src/lib/db/models/ticket';
import Order from '../../../../../src/lib/db/models/order';

describe('Tests for the PaymentDuplicateOrderListener object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new PaymentDuplicateOrderListener(stan!);

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

    const eventsData: NatsTypes.PaymentDuplicateOrderEventData[] = [
      {
        order: { id: savedOrder.id },
      },
      {
        order: { id: new mongoose.Types.ObjectId().toHexString() },
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, savedOrder, eventsData, msg };
  };

  describe('Success cases', () => {
    it('Should update order to cancelled status upon event arrival.', async () => {
      const { listener, savedOrder, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const order = await Order.findById(savedOrder.id);
      expect(order!.status).toBe('cancelled');
    });

    it('Should emit to order:cancelled channel after cancelling order.', async () => {
      const { listener, savedTicket, savedOrder, eventsData, msg } =
        await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const [stan] = stanSingleton.stan;
      expect(stan?.publish).toHaveBeenCalledWith(
        'order:cancelled',
        JSON.stringify({
          id: savedOrder.id,
          version: savedOrder.version + 1,
          ticket: {
            id: savedTicket.id,
          },
        }),
        expect.any(Function)
      );
    });

    it('Should acknowledge message after cancelling order.', async () => {
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
  });
});
