import { objects, ReturnTypes } from '@msnr-ticketing-app/common';

export namespace BCryptTypes {
  export type HashFunction = (
    password: string
  ) => ReturnTypes.AsyncTuple<
    string,
    InstanceType<typeof objects.errors.LibraryError>
  >;
  export type CompareFunction = (
    storedPassword: string,
    providedPassword: string
  ) => ReturnTypes.AsyncTuple<
    boolean,
    InstanceType<typeof objects.errors.LibraryError>
  >;
}
