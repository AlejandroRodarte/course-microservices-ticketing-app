import nats from 'node-nats-streaming';
import { objects } from '@msnr-ticketing-app/common';

class Stan {
  private _stan: nats.Stan | undefined;

  get stan(): [
    nats.Stan | undefined,
    InstanceType<typeof objects.errors.NatsError> | undefined
  ] {
    if (!this._stan)
      return [
        undefined,
        new objects.errors.NatsError(
          'The NATS client has not been initialized yet.'
        ),
      ];
    return [this._stan, undefined];
  }

  connect(): Promise<
    InstanceType<typeof objects.errors.NatsError> | undefined
  > {
    return new Promise((resolve, reject) => {
      if (this._stan) resolve(undefined);
      else {
        const stan = nats.connect(
          process.env.NATS_CLUSTER_ID!,
          process.env.NATS_CLIENT_ID!,
          {
            url: process.env.NATS_SERVER_URL!,
          }
        );
        stan.on('connect', () => {
          this._stan = stan;
          resolve(undefined);
        });
        stan.on('error', () => {
          resolve(
            new objects.errors.NatsError(
              'An error occurred while trying to connect to the NATS server.'
            )
          );
        });
      }
    });
  }
}

const stanSingleton = new Stan();

export default stanSingleton;
