import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { DbModelTypes } from '../../types/db/models';

const ticketSchema = new mongoose.Schema<
  DbModelTypes.TicketDocument,
  DbModelTypes.TicketModel
>({
  orderId: {
    type: String,
    required: false,
  },
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.static(
  'build',
  function (attrs: DbModelTypes.TicketAttributes): DbModelTypes.TicketDocument {
    const { id, ...rest } = attrs;
    return new Ticket({ _id: id, ...rest });
  }
);

const Ticket = mongoose.model<
  DbModelTypes.TicketDocument,
  DbModelTypes.TicketModel
>('Ticket', ticketSchema);

export default Ticket;
