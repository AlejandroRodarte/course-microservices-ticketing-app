import { TicketsObjectDtoTypes } from '../dto/tickets';

export namespace TicketsObjectDataTypes {
  export interface NewTicketData {
    newTicket: TicketsObjectDtoTypes.BaseTicketDto;
  }

  export interface GetTicketsData {
    tickets: TicketsObjectDtoTypes.BaseTicketDto[];
  }

  export interface GetTicketData {
    ticket: TicketsObjectDtoTypes.BaseTicketDto;
  }
}
