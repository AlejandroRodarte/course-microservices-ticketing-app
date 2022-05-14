import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import TickerCreatedListener from './objects/ticket-created-listener';

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

  new TickerCreatedListener(client).listen();
});

process.on('SIGTERM', () => client.close());
process.on('SIGINIT', () => client.close());
