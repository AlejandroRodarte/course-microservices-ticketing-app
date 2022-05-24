import { ProcessPromiseFunction } from 'bull';
import ExpirationCompletePublisher from '../../../objects/nats/publishers/expiration-complete-publisher';
import stanSingleton from '../../../objects/nats/stan-singleton';
import { BullQueueTypes } from '../../../types/bull/queues';

const processHandler: ProcessPromiseFunction<
  BullQueueTypes.OrderExpirationJobPayload
> = async (job) => {
  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) throw stanUnconnectedError;

  console.log(
    `[expiration] NATS client ${process.env.NATS_CLIENT_ID} emitting event to expiration:complete channel.`
  );
  const natsError = await new ExpirationCompletePublisher(stan!).publish({
    order: {
      id: job.data.orderId,
    },
  });
  if (natsError) throw natsError;
};

export default processHandler;
