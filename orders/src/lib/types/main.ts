import { Server } from 'http';
import { objects, ReturnTypes } from '@msnr-ticketing-app/common';

export namespace MainTypes {
  type MainFunctionError =
    | InstanceType<typeof objects.errors.DatabaseConnectionError>
    | InstanceType<typeof objects.errors.NatsError>;
  export type MainFunction = () => ReturnTypes.AsyncTuple<
    Server,
    MainFunctionError
  >;
  export type OnFullfilledCallback = (
    tuple: [Server | undefined, MainFunctionError | undefined]
  ) => void;
}
