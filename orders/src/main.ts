import { db } from '@msnr-ticketing-app/common';
import app from './app';
import setFromDockerSecrets from './lib/env/set-from-docker-secrets';
import ExpirationCompleteListener from './lib/objects/nats/listeners/expiration-complete-listener';
import PaymentCreatedListener from './lib/objects/nats/listeners/payment-created-listener';
import PaymentDuplicateOrderListener from './lib/objects/nats/listeners/payment-duplicate-order-listener';
import TicketCreatedListener from './lib/objects/nats/listeners/ticket-created-listener';
import TicketUpdatedListener from './lib/objects/nats/listeners/ticket-updated-listener';
import stanSingleton from './lib/objects/nats/stan-singleton';
import { MainTypes } from './lib/types/main';

const connection = db.mongoose.createConnection({
  microservice: {
    name: {
      short: 'orders',
      long: 'orders',
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
const port = process.env.PORT || 3003;

const start: MainTypes.MainFunction = async () => {
  const [, databaseConnectionError] = await connection.connect();
  if (databaseConnectionError) return [undefined, databaseConnectionError];

  const natsError = await stanSingleton.connect();
  if (natsError) return [undefined, natsError];
  console.log(
    `[orders] Connected client ${process.env.NATS_CLIENT_ID} to NATS server on orders microservice.`
  );

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) return [undefined, stanUnconnectedError];

  new TicketCreatedListener(stan!).listen();
  new TicketUpdatedListener(stan!).listen();
  new ExpirationCompleteListener(stan!).listen();
  new PaymentDuplicateOrderListener(stan!).listen();
  new PaymentCreatedListener(stan!).listen();

  const server = app.listen(port, () => {
    console.log(`[orders] Orders microservice launched on port ${port}`);
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
      `[orders] Error mounting the orders microservice: ${mainFunctionError.message}`
    );
    return;
  }
  // app mounted: define graceful shutdown code
  if (server) {
    const shutdown = async () => {
      // shut down express.js server and disconnect from database
      server.close();
      console.log(
        '[orders] Express.js server closed in the orders microservice.'
      );
      const [stan] = stanSingleton.stan;
      if (stan) stan.close();
      console.log(
        `[orders] Disconnected client ${process.env.NATS_CLIENT_ID} from NATS server in orders microservice.`
      );
      const databaseConnectionError = await connection.disconnect();
      // error disconnecting: exit with 1 status code
      if (databaseConnectionError) process.exitCode = 1;
      else process.exitCode = 0;
      process.exit();
    };
    // register SIGINT (ctrl + c)
    process.on('SIGINT', () => {
      console.log('[orders] Capturing SIGINT in the orders microservice.');
      shutdown();
    });
    // register SIGTERM (container quits properly)
    process.on('SIGTERM', () => {
      console.log('[orders] Capturing SIGTERM in the orders microservice.');
      shutdown();
    });
    return;
  }
};

const main = { start, onFullfilled };

export default main;
