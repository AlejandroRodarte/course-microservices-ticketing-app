import { objects, ReturnTypes } from '@msnr-ticketing-app/common';
import Stripe from 'stripe';

export namespace StripeHelpers {
  export interface CreateArgs {
    instance: Stripe;
    params?: Stripe.ChargeCreateParams;
    options?: Stripe.RequestOptions;
  }

  export type CreateReturns = ReturnTypes.AsyncTuple<
    Stripe.Response<Stripe.Charge>,
    InstanceType<typeof objects.errors.LibraryError>
  >;

  export type CreateFunction = (args: CreateArgs) => CreateReturns;
}
