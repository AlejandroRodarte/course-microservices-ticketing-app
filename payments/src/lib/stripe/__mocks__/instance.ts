import Stripe from 'stripe';

const stripe = {
  charges: {
    create: jest.fn(
      (
        params?: Stripe.ChargeCreateParams,
        options?: Stripe.RequestOptions
      ): Promise<void> =>
        new Promise((resolve, reject) => {
          resolve();
        })
    ),
  },
};

export default stripe;
