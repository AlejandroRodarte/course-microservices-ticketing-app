import { objects } from '@msnr-ticketing-app/common';
import { Queue } from 'bull';

export namespace BullHelperTypes {
  export interface AddArgs<PayloadType> {
    queue: Queue<PayloadType>;
    payload: PayloadType;
    errorMessage: string;
  }

  export type AddReturns = Promise<
    undefined | InstanceType<typeof objects.errors.LibraryError>
  >;
}
