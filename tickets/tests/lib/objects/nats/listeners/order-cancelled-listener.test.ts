import { NatsTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import Ticket from '../../../../../src/lib/db/models/ticket';
import OrderCancelledListener from '../../../../../src/lib/objects/nats/listeners/order-cancelled-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';

describe('Tests for the OrderCancelledListener object.', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new OrderCancelledListener(stan!);

    const savedTicket = Ticket.build({
      title: 'Concert',
      price: 20,
      userId: new mongoose.Types.ObjectId().toHexString(),
    });
    const orderId = new mongoose.Types.ObjectId().toHexString();
    savedTicket.orderId = orderId;
    await savedTicket.save();

    const orderCancelledEventArray: NatsTypes.OrderCancelledEventData[] = [
      {
        id: orderId,
        version: 0,
        ticket: {
          id: savedTicket.id,
        },
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
          id: savedTicket.id,
        },
      },
      {
        id: orderId,
        version: 0,
        ticket: {
          id: new mongoose.Types.ObjectId().toHexString(),
        },
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, orderCancelledEventArray, msg };
  };

  describe('Success cases', () => {
    it('Should un-reserve ticket by removing the related orderId.', async () => {
      const { listener, savedTicket, orderCancelledEventArray, msg } =
        await setup();
      const [data] = orderCancelledEventArray;

      await listener.onMessage(msg, data);

      const ticket = await Ticket.findById(savedTicket.id);
      expect(ticket?.orderId).toBeUndefined();
    });

    it('Should emit a ticket:updated event once the ticket has been un-reserved.', async () => {
      const { listener, savedTicket, orderCancelledEventArray, msg } =
        await setup();
      const [data] = orderCancelledEventArray;

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
      const { listener, orderCancelledEventArray, msg } = await setup();
      const [data] = orderCancelledEventArray;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not acknowledge the message if an unknown order requests to cancel a reserved ticket.', async () => {
      const { listener, orderCancelledEventArray, savedTicket, msg } =
        await setup();
      const [, data] = orderCancelledEventArray;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();

      const ticket = await Ticket.findById(savedTicket.id);
      expect(ticket?.orderId).toBeDefined();
      expect(ticket?.orderId).toBe(savedTicket.orderId);
    });

    it('Should not acknowledge the message if ticket does not exist.', async () => {
      const { listener, orderCancelledEventArray, msg } = await setup();
      const [, , data] = orderCancelledEventArray;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
