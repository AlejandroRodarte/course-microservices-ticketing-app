import { NatsTypes, objects } from '@msnr-ticketing-app/common';

class OrderCreatedPublisher extends objects.nats
  .Publisher<NatsTypes.OrderCreatedEvent> {
  readonly subject = 'order:created';
}

export default OrderCreatedPublisher;
