import setFromDockerSecrets from './lib/env/set-from-docker-secrets';
import OrderCreatedListener from './lib/objects/nats/listeners/order-created-listener';
import stanSingleton from './lib/objects/nats/stan-singleton';
import { MainTypes } from './lib/types/main';

const start: MainTypes.MainFunction = async () => {
  if (
    ['production-docker', 'development-docker'].includes(process.env.NODE_ENV!)
  )
    setFromDockerSecrets();

  const natsError = await stanSingleton.connect();
  if (natsError) return [undefined, natsError];
  console.log(
    `[expiration] Connected client ${process.env.NATS_CLIENT_ID} to NATS server on expiration microservice.`
  );

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) return [undefined, stanUnconnectedError];

  new OrderCreatedListener(stan!).listen();

  return [true, undefined];
};

const onFullfilled: MainTypes.OnFullfilledCallback = ([
  mounted,
  mainFunctionError,
]) => {
  // error mounting app: log error
  if (mainFunctionError) {
    console.log(
      `[expiration] Error mounting the expiration microservice: ${mainFunctionError.message}`
    );
    return;
  }
  // app mounted: define graceful shutdown code
  if (mounted) {
    const shutdown = async () => {
      const [stan] = stanSingleton.stan;
      if (stan) stan.close();
      console.log(
        `[expiration] Disconnected client ${process.env.NATS_CLIENT_ID} from NATS server in expiration microservice.`
      );
      process.exitCode = 0;
      process.exit();
    };
    // register SIGINT (ctrl + c)
    process.on('SIGINT', () => {
      console.log(
        '[expiration] Capturing SIGINT in the expiration microservice.'
      );
      shutdown();
    });
    // register SIGTERM (container quits properly)
    process.on('SIGTERM', () => {
      console.log(
        '[expiration] Capturing SIGTERM in the expiration microservice.'
      );
      shutdown();
    });
    return;
  }
};

const main = { start, onFullfilled };

export default main;
