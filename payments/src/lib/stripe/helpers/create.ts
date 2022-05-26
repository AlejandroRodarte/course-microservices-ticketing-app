import { objects } from '@msnr-ticketing-app/common';
import { StripeHelpers } from '../../types/stripe/helpers';

const create: StripeHelpers.CreateFunction = async ({
  instance,
  params,
  options,
}) => {
  try {
    const charge = await instance.charges.create(params, options);
    return [charge, undefined];
  } catch (e) {
    return [
      undefined,
      new objects.errors.LibraryError(
        'stripe',
        'There was an error creating the charge.'
      ),
    ];
  }
};

export default create;
