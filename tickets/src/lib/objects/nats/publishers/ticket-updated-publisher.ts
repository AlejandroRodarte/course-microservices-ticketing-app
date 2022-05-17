import { objects, NatsTypes } from '@msnr-ticketing-app/common';

class TicketUpdatedPublisher extends objects.nats
  .Publisher<NatsTypes.TicketUpdatedEvent> {
  readonly subject = 'ticket:updated';
}

export default TicketUpdatedPublisher;
