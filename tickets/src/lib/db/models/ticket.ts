import mongoose from 'mongoose';
import { DbModelTypes } from '../../types/db/models';

const ticketSchema = new mongoose.Schema({
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

ticketSchema.statics.build = function (
  attributes: DbModelTypes.TicketAttributes
) {
  return new Ticket(attributes);
};

const Ticket = mongoose.model<
  DbModelTypes.TicketDocument,
  DbModelTypes.TicketModel
>('User', ticketSchema);

export default Ticket;
