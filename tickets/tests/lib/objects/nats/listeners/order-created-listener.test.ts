import { NatsTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../../../src/lib/db/models/ticket';
import OrderCreatedListener from '../../../../../src/lib/objects/nats/listeners/order-created-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';

describe('Tests for the OrderCreatedListener object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new OrderCreatedListener(stan!);

    const savedTicket = Ticket.build({
      title: 'Concert',
      price: 20,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    await savedTicket.save();

    const orderCreatedEventDataArray: NatsTypes.OrderCreatedEventData[] = [
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: 'created',
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
        ticket: {
          id: savedTicket.id,
          price: 20,
        },
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: 'created',
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date().toISOString(),
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

    return { listener, savedTicket, orderCreatedEventDataArray, msg };
  };

  describe('Success cases', () => {
    it('Should reserve ticket by assigning it the related orderId.', async () => {
      const { listener, savedTicket, orderCreatedEventDataArray, msg } =
        await setup();
      const [data] = orderCreatedEventDataArray;

      await listener.onMessage(msg, data);

      const ticket = await Ticket.findById(savedTicket.id);

      expect(ticket?.orderId).toBeDefined();
      expect(ticket?.orderId).toBe(data.id);
    });

    it('Should emit a ticket:updated event once the ticket has been reserved.', async () => {
      const { listener, savedTicket, orderCreatedEventDataArray, msg } =
        await setup();
      const [data] = orderCreatedEventDataArray;

      await listener.onMessage(msg, data);

      const ticket = await Ticket.findById(savedTicket.id);

      const [stan] = stanSingleton.stan;
      expect(stan!.publish).toHaveBeenCalledWith(
        'ticket:updated',
        JSON.stringify({
          id: ticket!.id,
          title: ticket!.title,
          price: ticket!.price,
          userId: ticket!.userId,
          version: ticket!.version,
        }),
        expect.any(Function)
      );
    });

    it('Should acknowledge the message after the ticket is reserved.', async () => {
      const { listener, orderCreatedEventDataArray, msg } = await setup();
      const [data] = orderCreatedEventDataArray;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not acknowledge the message if no ticket is found in the database.', async () => {
      const { listener, orderCreatedEventDataArray, msg } =
        await setup();
      const [, data] = orderCreatedEventDataArray;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
