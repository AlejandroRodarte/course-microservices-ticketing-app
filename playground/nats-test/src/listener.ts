import { randomBytes } from 'crypto';
import TickerCreatedListener from './objects/ticket-created-listener';
import createClient from './create-client';

console.clear();

const main = async () => {
  const client = await createClient(
    'ticketing',
    randomBytes(4).toString('hex'),
    {
      url: 'http://localhost:4222',
    }
  );

  client.on('close', () => {
    console.log('Closing listener...');
    process.exit();
  });

  process.on('SIGTERM', () => client.close());
  process.on('SIGINIT', () => client.close());

  new TickerCreatedListener(client).listen();
};

main();
