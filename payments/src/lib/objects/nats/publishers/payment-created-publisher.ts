import { NatsTypes, objects } from '@msnr-ticketing-app/common';

class PaymentCreatedPublisher extends objects.nats
  .Publisher<NatsTypes.PaymentCreatedOrderEvent> {
  readonly subject = 'payment:created';
}

export default PaymentCreatedPublisher;
