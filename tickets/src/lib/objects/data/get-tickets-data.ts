import BaseTicketDto from '../dto/base-ticket-dto';

interface IGetTicketsData {
  tickets: BaseTicketDto[];
}

class GetTicketsData {
  private _tickets: BaseTicketDto[];

  constructor(tickets: BaseTicketDto[]) {
    this._tickets = tickets;
  }

  toJSON(): IGetTicketsData {
    return {
      tickets: this.tickets,
    };
  }

  get tickets() {
    return this._tickets;
  }

  set tickets(tickets: BaseTicketDto[]) {
    this._tickets = tickets;
  }
}

export default GetTicketsData;
