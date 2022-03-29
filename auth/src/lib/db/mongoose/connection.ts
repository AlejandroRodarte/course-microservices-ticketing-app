import mongoose from 'mongoose';
import setFromDockerSecrets from '../../env/set-from-docker-secrets';
import DatabaseConnectionError from '../../objects/errors/database-connection-error';
import { MongooseTypes } from '../../types/db/mongoose';

const createConnection: MongooseTypes.CreateConnectionFunction = () => {
  let connection: MongooseTypes.Connection = undefined;

  const connect: MongooseTypes.ConnectFunction = async () => {
    if (connection) return [connection, undefined];
    try {
      if (
        process.env.NODE_ENV! === 'production-docker' ||
        process.env.NODE_ENV! === 'development-docker'
      )
        setFromDockerSecrets();
      connection = await mongoose.connect(process.env.MONGODB_URL!);
      console.log(
        `[auth] Succesfully connected to MongoDB database at ${process.env
          .MONGODB_URL!}.`
      );
      return [connection, undefined];
    } catch (e) {
      return [
        undefined,
        new DatabaseConnectionError(
          'There was a problem connecting to the database.'
        ),
      ];
    }
  };

  const disconnect: MongooseTypes.DisconnectFunction = async () => {
    if (connection) {
      try {
        await connection.disconnect();
        console.log(
          '[auth] Succesfully disconnected from the database in the authentication microservice.'
        );
        connection = undefined;
        return undefined;
      } catch (e) {
        return new DatabaseConnectionError(
          'There was a problem disconnecting from the database.'
        );
      }
    }
    return undefined;
  };

  return { connect, disconnect };
};

const connection = createConnection();

export default connection;
