import { Server } from 'http';
import DatabaseConnectionError from '../objects/errors/database-connection-error';
import { ReturnTypes } from './returns';

export namespace MainTypes {
  type MainFunctionError = DatabaseConnectionError;
  export type MainFunction = () => ReturnTypes.AsyncTuple<
    Server,
    MainFunctionError
  >;
  export type OnFullfilledCallback = (
    tuple: [Server | undefined, MainFunctionError | undefined]
  ) => void;
}
