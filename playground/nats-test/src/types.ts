export interface TicketCreatedEventData {
  id: string;
  title: string;
  price: number;
}

export interface TicketCreatedEvent {
  subject: 'ticket:created';
  data: TicketCreatedEventData;
}

export type Event = TicketCreatedEvent;
