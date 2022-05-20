import {
  constants,
  db,
  objects,
  ReturnTypes,
} from '@msnr-ticketing-app/common';
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

ticketSchema.method('isReserved', async function (): ReturnTypes.AsyncTuple<
  boolean,
  InstanceType<typeof objects.errors.DatabaseOperationError>
> {
  const ticket = this as DbModelTypes.TicketDocument;
  const Order = mongoose.model('Order') as DbModelTypes.OrderModel;

  const [existingOrder, findOneExistingOrderError] = await db.helpers.findOne<
    DbModelTypes.OrderDocument,
    DbModelTypes.OrderModel
  >({
    Model: Order,
    filters: {
      ticket,
      status: {
        $in: constants.resources.order.statuses.filter(
          (status) => status !== 'cancelled'
        ),
      },
    },
    errorMessage: `Error finding order that matches ticket ID ${ticket._id} and that is not cancelled.`,
  });

  if (findOneExistingOrderError) return [undefined, findOneExistingOrderError];
  return [!!existingOrder, undefined];
});

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
