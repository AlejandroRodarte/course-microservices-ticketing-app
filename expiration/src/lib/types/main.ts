import { objects, ReturnTypes } from '@msnr-ticketing-app/common';

export namespace MainTypes {
  type MainFunctionError = InstanceType<typeof objects.errors.NatsError>;
  export type MainFunction = () => ReturnTypes.AsyncTuple<
    boolean,
    MainFunctionError
  >;
  export type OnFullfilledCallback = (
    tuple: [boolean | undefined, MainFunctionError | undefined]
  ) => void;
}
