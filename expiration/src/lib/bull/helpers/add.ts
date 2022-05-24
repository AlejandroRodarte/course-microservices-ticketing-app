import { objects } from '@msnr-ticketing-app/common';
import { BullHelperTypes } from '../../types/bull/helpers';

async function add<PayloadType>({
  queue,
  payload,
  errorMessage,
  opts,
}: BullHelperTypes.AddArgs<PayloadType>): BullHelperTypes.AddReturns {
  try {
    await queue.add(payload, opts);
    return undefined;
  } catch (e) {
    return new objects.errors.LibraryError('bull', errorMessage);
  }
}

export default add;
