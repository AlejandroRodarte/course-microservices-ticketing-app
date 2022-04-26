import BaseTicketDto from '../dto/base-ticket-dto';

interface IUpdateTicketData {
  updatedTicket: BaseTicketDto;
}

class UpdateTicketData {
  private _updatedTicket: BaseTicketDto;

  constructor(updatedTicket: BaseTicketDto) {
    this._updatedTicket = updatedTicket;
  }

  toJSON(): IUpdateTicketData {
    return {
      updatedTicket: this.updatedTicket,
    };
  }

  get updatedTicket() {
    return this._updatedTicket;
  }

  set updatedTicket(updatedTicket: BaseTicketDto) {
    this._updatedTicket = updatedTicket;
  }
}

export default UpdateTicketData;
