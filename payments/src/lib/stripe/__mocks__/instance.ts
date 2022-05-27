import Stripe from 'stripe';

const stripe = {
  charges: {
    create: jest.fn(
      (
        params?: Stripe.ChargeCreateParams,
        options?: Stripe.RequestOptions
      ): Promise<{ id: string }> =>
        new Promise((resolve, reject) => {
          resolve({ id: 'some-cool-stripe-charge-id' });
        })
    ),
  },
};

export default stripe;
