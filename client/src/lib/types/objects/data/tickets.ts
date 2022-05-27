import { TicketsDtoTypes } from '../dto/tickets';

export namespace TicketsDataTypes {
  export interface NewTicketData {
    newTicket: TicketsDtoTypes.BaseTicketDto;
  }
}
