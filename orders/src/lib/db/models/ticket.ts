import mongoose from 'mongoose';
import { DbModelTypes } from '../../types/db/models';

const ticketSchema = new mongoose.Schema<
  DbModelTypes.TicketDocument,
  DbModelTypes.TicketModel
>({
  title: {
    type: String,
    required: [true, 'A title is required.'],
  },
  price: {
    type: Number,
    required: [true, 'A price is required'],
    min: 0,
  },
});

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
>('Ticket', ticketSchema);

export default Ticket;
