import app from './app';
import connection from './lib/db/mongoose/connection';
import { MainTypes } from './lib/types/main';

const port = process.env.PORT || 3000;

const start: MainTypes.MainFunction = async () => {
  const [, databaseConnectionError] = await connection.connect();
  if (databaseConnectionError) return [undefined, databaseConnectionError];

  const server = app.listen(port, () => {
    console.log(`[auth] Authentication microservice launched on port ${port}`);
  });

  return [server, undefined];
};

const onFullfilled: MainTypes.OnFullfilledCallback = ([
  server,
  mainFunctionError,
]) => {
  // error mounting app: log error
  if (mainFunctionError) {
    console.log(
      `[auth] Error mounting the authentication microservice: ${mainFunctionError.message}`
    );
    return;
  }
  // app mounted: define graceful shutdown code
  if (server) {
    const shutdown = async () => {
      // shut down express.js server and disconnect from database
      server.close();
      console.log(
        '[auth] Express.js server closed in the authentication microservice.'
      );
      const databaseConnectionError = await connection.disconnect();
      // error disconnecting: exit with 1 status code
      if (databaseConnectionError) process.exitCode = 1;
      else process.exitCode = 0;
      process.exit();
    };
    // register SIGINT (ctrl + c)
    process.on('SIGINT', () => {
      console.log(
        '[auth] Capturing SIGINT in the authentication microservice.'
      );
      shutdown();
    });
    // register SIGTERM (container quits properly)
    process.on('SIGTERM', () => {
      console.log(
        '[auth] Capturing SIGTERM in the authentication microservice.'
      );
      shutdown();
    });
    return;
  }
};

const main = { start, onFullfilled };

export default main;
