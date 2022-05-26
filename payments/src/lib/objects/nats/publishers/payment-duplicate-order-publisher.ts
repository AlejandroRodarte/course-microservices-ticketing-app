import { NatsTypes, objects } from '@msnr-ticketing-app/common';

class PaymentDuplicateOrderPublisher extends objects.nats
  .Publisher<NatsTypes.PaymentDuplicateOrderEvent> {
  readonly subject = 'payment:duplicate-order';
}

export default PaymentDuplicateOrderPublisher;
