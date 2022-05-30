import './lib/env/set-docker-secrets';
import { db } from '@msnr-ticketing-app/common';
import app from './app';
import setFromDockerSecrets from './lib/env/set-from-docker-secrets';
import OrderCancelledListener from './lib/objects/nats/listeners/order-cancelled-listener';
import OrderCompletedListener from './lib/objects/nats/listeners/order-completed-listener';
import OrderCreatedListener from './lib/objects/nats/listeners/order-created-listener';
import TicketCreatedListener from './lib/objects/nats/listeners/ticket-created-listener';
import TicketUpdatedListener from './lib/objects/nats/listeners/ticket-updated-listener';
import stanSingleton from './lib/objects/nats/stan-singleton';
import { MainTypes } from './lib/types/main';

const connection = db.mongoose.createConnection({
  microservice: {
    name: {
      short: 'payments',
      long: 'payments',
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
const port = process.env.PORT || 3004;

const start: MainTypes.MainFunction = async () => {
  const [, databaseConnectionError] = await connection.connect();
  if (databaseConnectionError) return [undefined, databaseConnectionError];

  const natsError = await stanSingleton.connect();
  if (natsError) return [undefined, natsError];

  console.log(
    `[payments] Connected client ${process.env.NATS_CLIENT_ID} to NATS server on payments microservice.`
  );

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) return [undefined, stanUnconnectedError];

  new TicketCreatedListener(stan!).listen();
  new TicketUpdatedListener(stan!).listen();
  new OrderCreatedListener(stan!).listen();
  new OrderCancelledListener(stan!).listen();
  new OrderCompletedListener(stan!).listen();

  const server = app.listen(port, () => {
    console.log(`[payments] Payments microservice launched on port ${port}`);
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
      `[payments] Error mounting the payments microservice: ${mainFunctionError.message}`
    );
    return;
  }
  // app mounted: define graceful shutdown code
  if (server) {
    const shutdown = async () => {
      // shut down express.js server and disconnect from database
      server.close();
      console.log(
        '[payments] Express.js server closed in the payments microservice.'
      );
      const [stan] = stanSingleton.stan;
      if (stan) stan.close();
      console.log(
        `[payments] Disconnected client ${process.env.NATS_CLIENT_ID} from NATS server in payments microservice.`
      );
      const databaseConnectionError = await connection.disconnect();
      // error disconnecting: exit with 1 status code
      if (databaseConnectionError) process.exitCode = 1;
      else process.exitCode = 0;
      process.exit();
    };
    // register SIGINT (ctrl + c)
    process.on('SIGINT', () => {
      console.log('[payments] Capturing SIGINT in the payments microservice.');
      shutdown();
    });
    // register SIGTERM (container quits properly)
    process.on('SIGTERM', () => {
      console.log('[payments] Capturing SIGTERM in the payments microservice.');
      shutdown();
    });
    return;
  }
};

const main = { start, onFullfilled };

export default main;
