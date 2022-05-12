import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener connected to NATS.');

  const subscription = client.subscribe('ticket:created', 'orders-service-queue-group');

  subscription.on('message', (msg: nats.Message) => {
    const stringifiedData = msg.getData();
    if (typeof stringifiedData === 'string') {
      const data = JSON.parse(stringifiedData);
      console.log(
        `Received event #${msg.getSequence()}, with data ${JSON.stringify(
          data,
          undefined,
          2
        )}.`
      );
    }
  });
});
