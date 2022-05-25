import { constants, OrderResourceTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { DbModelTypes } from '../../types/db/models';

const orderSchema = new mongoose.Schema<
  DbModelTypes.OrderDocument,
  DbModelTypes.OrderModel
>({
  status: {
    type: String,
    required: [true, 'An order status is required.'],
    validate: [
      (status: OrderResourceTypes.Status) => {
        const isValidStatus =
          constants.resources.order.statuses.includes(status);
        if (!isValidStatus) throw new Error('Invalid order status');
      },
      'Order status must match one of the four valid types: created, cancelled, awaiting:payment, or complete.',
    ],
  },
  userId: {
    type: String,
    required: [true, 'A user ID is required.'],
  },
  price: {
    type: Number,
    required: [true, 'A price is required.'],
    min: 0,
  },
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.static(
  'build',
  function (
    attributes: DbModelTypes.OrderAttributes
  ): DbModelTypes.OrderDocument {
    const { id, ...rest } = attributes;
    return new Order({ _id: id, ...rest });
  }
);

const Order = mongoose.model<
  DbModelTypes.OrderDocument,
  DbModelTypes.OrderModel
>('Order', orderSchema);

export default Order;
