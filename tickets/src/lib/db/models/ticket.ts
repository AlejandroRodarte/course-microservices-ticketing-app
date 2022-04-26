import { db, objects, ReturnTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import { DbModelTypes } from '../../types/db/models';

const ticketSchema = new mongoose.Schema<
  DbModelTypes.TicketDocument,
  DbModelTypes.TicketModel
>({
  title: {
    type: String,
    required: [true, 'An title is required when creating a ticket.'],
  },
  price: {
    type: Number,
    required: [true, 'A password is required when creating a ticket.'],
    validate(price: number) {
      if (price < 0)
        throw new Error("The ticket's price should be greater than 0.");
    },
  },
  userId: {
    type: String,
    required: [true, 'A user ID is required when creating a ticket.'],
  },
});

ticketSchema.method(
  'updateFields',
  async function (
    attributes: Partial<DbModelTypes.TicketAttributes>
  ): Promise<
    [
      DbModelTypes.TicketDocument | undefined,
      InstanceType<typeof objects.errors.DatabaseOperationError> | undefined
    ]
  > {
    const ticket = this as DbModelTypes.TicketDocument;

    if (attributes.title) ticket.title = attributes.title;
    if (attributes.price) ticket.price = attributes.price;

    const [updatedTicket, updateTicketError] =
      await db.helpers.save<DbModelTypes.TicketDocument>({
        document: ticket,
        errorMessage: `An error occured while trying O to update ticket with ID ${ticket.id}`,
      });

    if (updateTicketError) return [undefined, updateTicketError];
    return [updatedTicket, undefined];
  }
);

ticketSchema.static(
  'build',
  function (
    attributes: DbModelTypes.TicketAttributes
  ): DbModelTypes.TicketDocument {
    return new Ticket(attributes);
  }
);

const Ticket = mongoose.model<
  DbModelTypes.TicketDocument,
  DbModelTypes.TicketModel
>('User', ticketSchema);

export default Ticket;
