import Bull from 'bull';
import { BullQueueTypes } from '../../../../types/bull/queues';

const expirationQueue = {
  add: jest.fn(
    (
      payload: BullQueueTypes.OrderExpirationJobPayload,
      opts?: Bull.JobOptions
    ) => {}
  ),
};

export default expirationQueue;
