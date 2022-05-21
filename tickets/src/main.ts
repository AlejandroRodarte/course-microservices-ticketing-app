import { db } from '@msnr-ticketing-app/common';
import app from './app';
import setFromDockerSecrets from './lib/env/set-from-docker-secrets';
import OrderCancelledListener from './lib/objects/nats/listeners/order-cancelled-listener';
import OrderCreatedListener from './lib/objects/nats/listeners/order-created-listener';
import stanSingleton from './lib/objects/nats/stan-singleton';
import { MainTypes } from './lib/types/main';

const connection = db.mongoose.createConnection({
  microservice: {
    name: {
      short: 'tickets',
      long: 'tickets',
    },
  },
  environment: {
    nodeEnv: 'NODE_ENV',
    mongoDbUrl: 'MONGODB_URL',
  },
  setter: {
    list: ['production-docker', 'development-docker'],
    fn: setFromDockerSecrets,
  },
});
const port = process.env.PORT || 3002;

const start: MainTypes.MainFunction = async () => {
  const [, databaseConnectionError] = await connection.connect();
  if (databaseConnectionError) return [undefined, databaseConnectionError];

  const natsError = await stanSingleton.connect();
  if (natsError) return [undefined, natsError];
  console.log(
    `[tickets] Connected client ${process.env.NATS_CLIENT_ID} to NATS server on ticketing microservice.`
  );

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) return [undefined, stanUnconnectedError];

  new OrderCreatedListener(stan!).listen();
  new OrderCancelledListener(stan!).listen();

  const server = app.listen(port, () => {
    console.log(`[tickets] Tickets microservice launched on port ${port}`);
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
      `[tickets] Error mounting the tickets microservice: ${mainFunctionError.message}`
    );
    return;
  }
  // app mounted: define graceful shutdown code
  if (server) {
    const shutdown = async () => {
      // shut down express.js server and disconnect from database
      server.close();
      console.log(
        '[tickets] Express.js server closed in the tickets microservice.'
      );
      const [stan] = stanSingleton.stan;
      if (stan) stan.close();
      console.log(
        `[tickets] Disconnected client ${process.env.NATS_CLIENT_ID} from NATS server in ticketing microservice.`
      );
      const databaseConnectionError = await connection.disconnect();
      // error disconnecting: exit with 1 status code
      if (databaseConnectionError) process.exitCode = 1;
      else process.exitCode = 0;
      process.exit();
    };
    // register SIGINT (ctrl + c)
    process.on('SIGINT', () => {
      console.log('[tickets] Capturing SIGINT in the tickets microservice.');
      shutdown();
    });
    // register SIGTERM (container quits properly)
    process.on('SIGTERM', () => {
      console.log('[tickets] Capturing SIGTERM in the tickets microservice.');
      shutdown();
    });
    return;
  }
};

const main = { start, onFullfilled };

export default main;
