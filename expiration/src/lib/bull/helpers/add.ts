import { objects } from '@msnr-ticketing-app/common';
import { BullHelperTypes } from '../../types/bull/helpers';

async function add<PayloadType>({
  queue,
  payload,
  errorMessage,
}: BullHelperTypes.AddArgs<PayloadType>): BullHelperTypes.AddReturns {
  try {
    await queue.add(payload);
    return undefined;
  } catch (e) {
    return new objects.errors.LibraryError('bull', errorMessage);
  }
}

export default add;
