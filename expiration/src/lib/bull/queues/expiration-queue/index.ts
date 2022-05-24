import Queue from 'bull';
import { BullQueueTypes } from '../../../types/bull/queues';
import processHandler from './process-handler';

const expirationQueue = new Queue<BullQueueTypes.OrderExpirationJobPayload>(
  'order:expiration',
  {
    redis: {
      host: process.env.REDIS_HOST,
    },
  }
);

expirationQueue.process(processHandler);

export default expirationQueue;
