import { NatsTypes, objects } from '@msnr-ticketing-app/common';

class OrderCancelledPublisher extends objects.nats
  .Publisher<NatsTypes.OrderCancelledEvent> {
  readonly subject = 'order:cancelled';
}

export default OrderCancelledPublisher;
