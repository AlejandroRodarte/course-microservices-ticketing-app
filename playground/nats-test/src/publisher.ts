import nats from 'node-nats-streaming';

console.clear();

// nats.connect(clusterID, clientID, { url: natsStreamingServerURL })
// clusterID was defined in our nats-deployment pod spec with the -cid flag
// clientID is any unique identifier you desire to provide to your NATS client
// natsStreamingServerURL is the URL where your NATS Streaming Server is located
// in the case of K8S, it would be something like http://nats-service:4222
const client = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

client.on('connect', () => {
  console.log('Publisher connected to NATS.');

  const data = {
    id: '123',
    title: 'concert',
    price: 20,
  };

  const stringifiedData = JSON.stringify(data);

  client.publish('ticket:created', stringifiedData, () => {
    console.log('Event published!');
  });
});
