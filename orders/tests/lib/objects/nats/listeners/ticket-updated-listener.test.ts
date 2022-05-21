import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import TicketUpdatedListener from '../../../../../src/lib/objects/nats/listeners/ticket-updated-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import Ticket from '../../../../../src/lib/db/models/ticket';

describe('Tests for the TicketUpdatedListener object.', () => {
  const setup = async () => {
    // 1. create an instance of the listener
    const [stan] = stanSingleton.stan;
    const listener = new TicketUpdatedListener(stan!);

    // 2. save a ticket into the database
    const savedTicket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'Concert',
      price: 20,
    });
    await savedTicket.save();

    // 2. create three fake TicketUpdatedEventData objects
    // 1. version 1 of persisted ticket
    // 2. version 2 of persisted ticket
    // 3. unknown ticket update
    const userId = new mongoose.Types.ObjectId().toHexString();
    const ticketUpdatedEventDataArray: NatsTypes.TicketUpdatedEventData[] = [
      {
        id: savedTicket.id,
        title: 'Concert 2',
        price: 25,
        userId,
        version: savedTicket.version + 1,
      },
      {
        id: savedTicket.id,
        title: 'Concert 3',
        price: 30,
        userId,
        version: savedTicket.version + 2,
      },
      {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Unknown concert',
        price: 100,
        userId,
        version: 1,
      },
    ];

    // 3. create a fake message object
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };

    return { listener, savedTicket, ticketUpdatedEventDataArray, msg };
  };

  describe('Success cases', () => {
    it('Should update a ticket and save it.', async () => {
      const { listener, savedTicket, ticketUpdatedEventDataArray, msg } =
        await setup();
      const [secondTicketVersion] = ticketUpdatedEventDataArray;

      // 4. call the onMessage function with the data and message objects
      await listener.onMessage(msg, secondTicketVersion);

      // 5. write assertion to make sure the ticket was updated
      const ticket = await Ticket.findById(savedTicket.id);

      expect(ticket).toBeDefined();
      expect(ticket?.title).toBe(secondTicketVersion.title);
      expect(ticket?.price).toBe(secondTicketVersion.price);
      expect(ticket?.version).toBe(secondTicketVersion.version);
    });

    it('Should acknowledge the message upon processing the event.', async () => {
      const { listener, ticketUpdatedEventDataArray, msg } = await setup();
      const [secondTicketVersion] = ticketUpdatedEventDataArray;

      // 6. write assertion to make sure msg.ack has been called
      await listener.onMessage(msg, secondTicketVersion);
      expect(msg.ack).toHaveBeenCalled();
    });
  });

  describe('Failure cases', () => {
    it('Should not acknowledge the message if no ticket is found in the database.', async () => {
      const { listener, ticketUpdatedEventDataArray, msg } = await setup();
      const [, , unknownTicketUpdate] = ticketUpdatedEventDataArray;

      await listener.onMessage(msg, unknownTicketUpdate);
      expect(msg.ack).not.toHaveBeenCalled();
    });

    it('Should not acknowledge the message and update if ticket exists, yet it has not processed the previous update version.', async () => {
      const { listener, savedTicket, ticketUpdatedEventDataArray, msg } =
        await setup();
      const [, thirdTicketVersion] = ticketUpdatedEventDataArray;

      await listener.onMessage(msg, thirdTicketVersion);
      expect(msg.ack).not.toHaveBeenCalled();

      const ticket = await Ticket.findById(savedTicket.id);

      expect(ticket?.title).toBe(savedTicket.title);
      expect(ticket?.price).toBe(savedTicket.price);
      expect(ticket?.version).toBe(savedTicket.version);
    });
  });
});
