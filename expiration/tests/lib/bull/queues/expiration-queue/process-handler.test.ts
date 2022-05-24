import mongoose from 'mongoose';
import Bull from 'bull';
import { BullQueueTypes } from '../../../../../src/lib/types/bull/queues';
import processHandler from '../../../../../src/lib/bull/queues/expiration-queue/process-handler';
import stanSingleton from '../../../../../src/lib/objects/nats/stan-singleton';

describe('Tests for the expirationQueue.process callback.', () => {
  describe('Success cases', () => {
    it('Should publish to the expiration:complete channel after job arrival.', async () => {
      // @ts-ignore
      const job: Bull.Job<BullQueueTypes.OrderExpirationJobPayload> = {
        data: {
          orderId: new mongoose.Types.ObjectId().toHexString(),
        },
      };

      await expect(processHandler(job)).resolves.not.toThrow();

      const [stan] = stanSingleton.stan;
      expect(stan?.publish).toHaveBeenCalledWith(
        'expiration:complete',
        JSON.stringify({
          order: {
            id: job.data.orderId,
          },
        }),
        expect.any(Function)
      );
    });
  });
});
