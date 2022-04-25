import BaseTicketDto from '../dto/base-ticket-dto';

interface IShowTicketData {
  ticket: BaseTicketDto;
}

class ShowTicketData {
  private _ticket: BaseTicketDto;

  constructor(ticket: BaseTicketDto) {
    this._ticket = ticket;
  }

  toJSON(): IShowTicketData {
    return {
      ticket: this.ticket,
    };
  }

  get ticket() {
    return this._ticket;
  }

  set ticket(ticket: BaseTicketDto) {
    this._ticket = ticket;
  }
}

export default ShowTicketData;
