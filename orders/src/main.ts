import { db } from '@msnr-ticketing-app/common';
import app from './app';
import setFromDockerSecrets from './lib/env/set-from-docker-secrets';
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
