import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { DbModelTypes } from '../../types/db/models';

const paymentSchema = new mongoose.Schema<
  DbModelTypes.PaymentDocument,
  DbModelTypes.PaymentModel
>({
  orderId: {
    type: String,
    required: [true, 'An order ID is required.'],
  },
  stripeId: {
    type: String,
    required: [true, 'A stripe ID is required.'],
  },
});

paymentSchema.set('versionKey', 'version');
paymentSchema.plugin(updateIfCurrentPlugin);

paymentSchema.static(
  'build',
  function (
    attributes: DbModelTypes.PaymentAttributes
  ): DbModelTypes.PaymentDocument {
    return new Payment(attributes);
  }
);

const Payment = mongoose.model<
  DbModelTypes.PaymentDocument,
  DbModelTypes.PaymentModel
>('Payment', paymentSchema);

export default Payment;
