import mongoose from 'mongoose';
import Ticket from '../../../../src/lib/db/models/ticket';

describe('Tests for the Ticket model', () => {
  describe('Versioning', () => {
    it('Implements optimistic concurrency control properly.', async () => {
      // 1. create an instance of a ticket
      const ticket = Ticket.build({
        title: 'Concert',
        price: 5,
        userId: new mongoose.Types.ObjectId().toHexString(),
      });

      // 2. save the ticket to the database
      await ticket.save();

      // 3. fetch the ticket twice
      const firstInstance = await Ticket.findById(ticket.id);
      const secondInstance = await Ticket.findById(ticket.id);

      // 4. make two separate changes to the tickets we fetched
      firstInstance!.price = 10;
      secondInstance!.price = 15;

      // 5. save the first fetched ticket
      await firstInstance!.save();

      // 6. save the second fetched ticket and expect an error
      await expect(secondInstance!.save()).rejects.toThrow();
    });

    it('Version gets incremented properly on multiple saves.', async () => {
      const ticket = Ticket.build({
        title: 'Concert',
        price: 5,
        userId: new mongoose.Types.ObjectId().toHexString(),
      });

      await ticket.save();
      expect(ticket.version).toBe(0);

      const firstInstance = await Ticket.findById(ticket.id);
      firstInstance!.price = 15;

      await firstInstance!.save();
      expect(firstInstance!.version).toBe(ticket.version + 1);

      const secondInstance = await Ticket.findById(ticket.id);
      secondInstance!.price = 25;

      await secondInstance!.save();
      expect(secondInstance!.version).toBe(firstInstance!.version + 1);
    });
  });
});
