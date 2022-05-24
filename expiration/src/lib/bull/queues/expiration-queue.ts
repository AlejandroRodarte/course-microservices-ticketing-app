import Queue from 'bull';
import { BullQueueTypes } from '../../types/bull/queues';

const expirationQueue = new Queue<BullQueueTypes.OrderExpirationJobPayload>(
  'order:expiration',
  {
    redis: {
      host: process.env.REDIS_HOST,
    },
  }
);

expirationQueue.process(async (job) => {
  console.log(
    `I want to publish an expiration:complete event for orderId: ${job.data.orderId}`
  );
});

export default expirationQueue;
