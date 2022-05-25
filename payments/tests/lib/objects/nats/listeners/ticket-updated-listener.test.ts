import { NatsTypes } from '@msnr-ticketing-app/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import Ticket from '../../../../../src/lib/db/models/ticket';
import TicketUpdatedListener from '../../../../../src/lib/objects/nats/listeners/ticket-updated-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';

describe('Tests for the TicketUpdatedListener', () => {
  const setup = async () => {
    const [stan] = stanSingleton.stan;
    const listener = new TicketUpdatedListener(stan!);

    const savedTicket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
    });
    await savedTicket.save();

    const eventsData: NatsTypes.TicketUpdatedEventData[] = [
      {
        id: savedTicket.id,
        title: 'Concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: savedTicket.version + 1,
        orderId: new mongoose.Types.ObjectId().toHexString(),
      },
      {
        id: savedTicket.id,
        title: 'Concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: savedTicket.version + 2,
        orderId: new mongoose.Types.ObjectId().toHexString(),
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: savedTicket.version + 1,
        orderId: new mongoose.Types.ObjectId().toHexString(),
      },
    ];

    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, eventsData, msg };
  };

  describe('Success cases', () => {
    it("Should update ticket's orderId upon event arrival.", async () => {
      const { listener, savedTicket, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);

      const ticket = await Ticket.findById(savedTicket.id);
      expect(ticket?.orderId).toBe(data.orderId);
    });

    it('Should acknowledge message after updating ticket.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not acknowledge message if previous ticket version is not found.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });

    it('Should not acknowledge message if ticket is not found in database.', async () => {
      const { listener, eventsData, msg } = await setup();
      const [, , data] = eventsData;

      await listener.onMessage(msg, data);
      expect(msg.ack).not.toHaveBeenCalled();
    });
  });
});
