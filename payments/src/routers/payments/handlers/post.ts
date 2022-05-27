import { objects, OrderResourceTypes } from '@msnr-ticketing-app/common';
import ApplicationResponse from '@msnr-ticketing-app/common/build/lib/objects/application-response';
import { Response } from 'express';
import Payment from '../../../lib/db/models/payment';
import PaymentDuplicateOrderPublisher from '../../../lib/objects/nats/publishers/payment-duplicate-order-publisher';
import stanSingleton from '../../../lib/objects/nats/stan-singleton';
import stripe from '../../../lib/stripe';
import { PaymentsRequestHandlers } from '../../../lib/types/request-handlers/payments';

const post = async (
  req: PaymentsRequestHandlers.PostPaymentExtendedRequest,
  res: Response
) => {
  const { token } = req.body.data.newCharge;

  if (req.order!.id !== req.order!.ticket.orderId) {
    const [stan, stanUnconnectedError] = stanSingleton.stan;
    if (stanUnconnectedError) throw stanUnconnectedError;

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

  return res
    .status(200)
    .send(
      new ApplicationResponse<undefined, undefined>(
        201,
        'CHARGE_CREATED',
        `Order with ID ${req.order!.id} completed. User charged for $${
          req.order!.price
        } USD.`,
        undefined,
        undefined
      )
    );
};

export default post;
