import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { NatsTypes } from '@msnr-ticketing-app/common';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';
import TicketCreatedListener from '../../../../../src/lib/objects/nats/listeners/ticket-created-listener';
import Ticket from '../../../../../src/lib/db/models/ticket';

describe('Tests for the TicketCreatedListener.', () => {
  describe('Success cases', () => {
    const setup = () => {
      const [stan] = stanSingleton.stan;
      const listener = new TicketCreatedListener(stan!);

      const data: NatsTypes.TicketCreatedEventData = {
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
      };

      // @ts-ignore
      const msg: Message = {
        ack: jest.fn(),
      };

      return { listener, data, msg };
    };

    it('Should save ticket id into the database.', async () => {
      const { listener, data, msg } = setup();
      await listener.onMessage(msg, data);

      const ticket = await Ticket.findById(data.id);
      expect(ticket).not.toBeNull();
    });

    it('Should acknowledge message after saving ticket id.', async () => {
      const { listener, data, msg } = setup();
      await listener.onMessage(msg, data);
      expect(msg.ack).toHaveBeenCalled();
    });
  });
});
