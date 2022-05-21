import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import TicketCreatedListener from '../../../../../src/lib/objects/nats/listeners/ticket-created-listener';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import Ticket from '../../../../../src/lib/db/models/ticket';

describe('Tests for the TicketCreatedListener object.', () => {
  describe('Success cases', () => {
    const setup = async () => {
      // 1. create an instance of the listener
      const [stan] = stanSingleton.stan;
      const listener = new TicketCreatedListener(stan!);

      // 2. create a fake TicketCreatedEventData object
      const data: NatsTypes.TicketCreatedEventData = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
      };

      // 3. create a fake message object
      // @ts-ignore
      const msg: Message = {
        ack: jest.fn(),
      };

      return { listener, data, msg };
    };

    it('Should create a ticket and save it.', async () => {
      const { listener, data, msg } = await setup();

      // 4. call the onMessage function with the data and message objects
      await listener.onMessage(msg, data);

      // 5. write assertion to make sure the ticket was created
      const ticket = await Ticket.findById(data.id);

      expect(ticket).toBeDefined();
      expect(ticket?.title).toBe(data.title);
      expect(ticket?.price).toBe(data.price);
      expect(ticket?.version).toBe(data.version);
    });

    it('Should acknowledge the message upon processing the event.', async () => {
      const { listener, data, msg } = await setup();

      // 6. write assertion to make sure msg.ack has been called
      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });
});
