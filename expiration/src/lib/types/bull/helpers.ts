import { objects } from '@msnr-ticketing-app/common';
import Bull, { Queue } from 'bull';

export namespace BullHelperTypes {
  export interface AddArgs<PayloadType> {
    queue: Queue<PayloadType>;
    payload: PayloadType;
    errorMessage: string;
    opts?: Bull.JobOptions;
  }

  export type AddReturns = Promise<
    undefined | InstanceType<typeof objects.errors.LibraryError>
  >;
}
