import { NatsTypes, objects } from '@msnr-ticketing-app/common';

class ExpirationCompletePublisher extends objects.nats
  .Publisher<NatsTypes.ExpirationCompleteEvent> {
  readonly subject = 'expiration:complete';
}

export default ExpirationCompletePublisher;
