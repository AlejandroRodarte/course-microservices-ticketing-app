import mongoose from 'mongoose';
import DatabaseConnectionError from '../../objects/errors/database-connection-error';
import { ReturnTypes } from '../returns';

export namespace MongooseTypes {
  export type Connection = typeof mongoose | undefined;
  export type ConnectFunction = () => ReturnTypes.AsyncTuple<
    Connection,
    DatabaseConnectionError
  >;
  export type DisconnectFunction = () => Promise<
    DatabaseConnectionError | undefined
  >;
  type CreateConnectionReturn = {
    connect: ConnectFunction;
    disconnect: DisconnectFunction;
  };
  export type CreateConnectionFunction = () => CreateConnectionReturn;
}
