import { randomBytes } from 'crypto';
import createClient from './create-client';
import TicketCreatedPublisher from './objects/ticket-created-publisher';
import { TicketCreatedEventData } from './types';

console.clear();

// nats.connect(clusterID, clientID, { url: natsStreamingServerURL })
// clusterID was defined in our nats-deployment pod spec with the -cid flag
// clientID is any unique identifier you desire to provide to your NATS client
// natsStreamingServerURL is the URL where your NATS Streaming Server is located
// in the case of K8S, it would be something like http://nats-service:4222
const main = async () => {
  const client = await createClient(
    'ticketing',
    randomBytes(4).toString('hex'),
    {
      url: 'http://localhost:4222',
    }
  );

  client.on('close', () => {
    console.log('Closing publisher...');
    process.exit();
  });

  const publisher = new TicketCreatedPublisher(client);

  const data: TicketCreatedEventData = {
    id: '123',
    title: 'concert',
    price: 20,
  };

  const error = await publisher.publish(data);
  if (error) console.log(error);

  process.on('SIGTERM', () => client.close());
  process.on('SIGINIT', () => client.close());
};

main();
