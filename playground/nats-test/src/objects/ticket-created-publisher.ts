import { TicketCreatedEvent } from '../types';
import Publisher from './publisher';

export default class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = 'ticket:created';
}
