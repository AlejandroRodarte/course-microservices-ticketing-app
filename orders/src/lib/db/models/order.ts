import mongoose from 'mongoose';
import { DbModelTypes } from '../../types/db/models';

const orderSchema = new mongoose.Schema<
  DbModelTypes.OrderDocument,
  DbModelTypes.OrderModel
>({
  userId: {
    type: String,
    required: [true, 'A user ID is required.'],
  },
  status: {
    type: String,
    required: [true, 'An order status is required.'],
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ticket',
  },
});

orderSchema.static(
  'build',
  function (
    attributes: DbModelTypes.OrderAttributes
  ): DbModelTypes.OrderDocument {
    return new Order(attributes);
  }
);

const Order = mongoose.model<
  DbModelTypes.OrderDocument,
  DbModelTypes.OrderModel
>('Order', orderSchema);

export default Order;
