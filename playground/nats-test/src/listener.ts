import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const client = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Listener connected to NATS.');

  client.on('close', () => {
    console.log('Closing listener...');
    process.exit();
  });

  const options = client
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable();

  const subscription = client.subscribe('ticket:created', options);

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
    msg.ack();
  });
});

process.on('SIGTERM', () => client.close());
process.on('SIGINIT', () => client.close());
