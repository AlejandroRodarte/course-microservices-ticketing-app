import { NatsTypes, objects } from '@msnr-ticketing-app/common';

class OrderCompletedPublisher extends objects.nats
  .Publisher<NatsTypes.OrderCompletedEvent> {
  readonly subject = 'order:completed';
}

export default OrderCompletedPublisher;
