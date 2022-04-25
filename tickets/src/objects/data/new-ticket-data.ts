import BaseTicketDto from '../dto/base-ticket-dto';

interface INewTicketData {
  newTicket: BaseTicketDto;
}

class NewTicketData {
  private _newTicket: BaseTicketDto;

  constructor(newTicket: BaseTicketDto) {
    this._newTicket = newTicket;
  }

  toJSON(): INewTicketData {
    return {
      newTicket: this.newTicket,
    };
  }

  get newTicket() {
    return this._newTicket;
  }

  set newTicket(newTicket: BaseTicketDto) {
    this._newTicket = newTicket;
  }
}

export default NewTicketData;
