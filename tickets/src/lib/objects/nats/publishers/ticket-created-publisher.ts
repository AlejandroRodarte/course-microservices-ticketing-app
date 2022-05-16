import { objects, NatsTypes } from '@msnr-ticketing-app/common';

class TicketCreatedPublisher extends objects.nats
  .Publisher<NatsTypes.TicketCreatedEvent> {
  readonly subject = 'ticket:created';
}

export default TicketCreatedPublisher;
