import { db, objects, OrderResourceTypes } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Payment from '../../../lib/db/models/payment';
import NewPaymentData from '../../../lib/objects/data/new-payment-data';
import BasePaymentDto from '../../../lib/objects/dto/base-payment-dto';
import PaymentCreatedPublisher from '../../../lib/objects/nats/publishers/payment-created-publisher';
import PaymentDuplicateOrderPublisher from '../../../lib/objects/nats/publishers/payment-duplicate-order-publisher';
import stanSingleton from '../../../lib/objects/nats/stan-singleton';
import stripe from '../../../lib/stripe';
import { DbModelTypes } from '../../../lib/types/db/models';
import { PaymentsRequestHandlers } from '../../../lib/types/request-handlers/payments';

const post = async (
  req: PaymentsRequestHandlers.PostPaymentExtendedRequest,
  res: Response
) => {
  const { token } = req.body.data.newCharge;

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) throw stanUnconnectedError;

  if (!req.order!.ticket.orderId)
    throw new objects.errors.BadEntityError(
      'ticket',
      `Ticket with ID ${
        req.order!.ticket.id
      } appears to be un-reserved due to the tickets service being down. Will not accept payment for now.`
    );

  if (req.order!.id !== req.order!.ticket.orderId) {
    console.log(
      `[payments] NATS client ${process.env.NATS_CLIENT_ID} emitting event to payment:duplicate-order channel.`
    );

    const natsError = await new PaymentDuplicateOrderPublisher(stan!).publish({
      order: {
        id: req.order!.id,
      },
    });
    if (natsError) throw natsError;

    throw new objects.errors.BadEntityError(
      'order',
      `Order with ID ${req.order!.id} did not actually reserve ticket with ID ${
        req.order!.ticket.id
      }. This order will be cancelled.`
    );
  }

  const invalidStatuses: OrderResourceTypes.Status[] = [
    'cancelled',
    'complete',
  ];

  if (invalidStatuses.includes(req.order!.status))
    throw new objects.errors.BadEntityError(
      'order',
      `Order with ID ${req.order!.id} is ${
        req.order!.status
      }, thus can not accept a payment.`
    );

  const [charge, stripeError] = await stripe.helpers.create({
    instance: stripe.instance,
    params: {
      currency: 'usd',
      amount: req.order!.price * 100,
      source: token,
    },
  });
  if (stripeError) throw stripeError;

  const payment = Payment.build({
    orderId: req.order!.id,
    stripeId: charge.id,
  });

  const [savedPayment, savePaymentError] =
    await db.helpers.save<DbModelTypes.PaymentDocument>({
      document: payment,
      errorMessage: 'There was an error saving the new payment.',
    });
  if (savePaymentError) throw savePaymentError;

  const natsError = await new PaymentCreatedPublisher(stan!).publish({
    id: savedPayment.id,
    stripeId: savedPayment.stripeId,
    order: {
      id: req.order!.id,
    },
  });
  if (natsError) throw natsError;

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<NewPaymentData, undefined>(
        201,
        'CHARGE_CREATED',
        `Order with ID ${req.order!.id} completed. User charged for $${
          req.order!.price
        } USD.`,
        new NewPaymentData(BasePaymentDto.fromPaymentDocument(savedPayment!)),
        undefined
      )
    );
};

export default post;
