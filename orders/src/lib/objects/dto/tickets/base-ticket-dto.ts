import { DbModelTypes } from '../../../types/db/models';
import { DtoTypes } from '../../../types/objects/dto';

class BaseTicketDto {
  private _id: string;
  private _title: string;
  private _price: number;

  constructor(id: string, title: string, price: number) {
    this._id = id;
    this._title = title;
    this._price = price;
  }

  toJSON(): DtoTypes.IBaseTicketDto {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
    };
  }

  static fromTicketDocument(
    ticketDocument: DbModelTypes.TicketDocument
  ): BaseTicketDto {
    return new BaseTicketDto(
      ticketDocument._id,
      ticketDocument.title,
      ticketDocument.price
    );
  }

  static fromTicketDocumentArray(
    ticketDocuments: DbModelTypes.TicketDocument[]
  ) {
    return ticketDocuments.map((ticket) => this.fromTicketDocument(ticket));
  }

  get id() {
    return this._id;
  }

  get title() {
    return this._title;
  }

  get price() {
    return this._price;
  }

  set id(id: string) {
    this._id = id;
  }

  set title(title: string) {
    this._title = title;
  }

  set price(price: number) {
    this._price = price;
  }
}

export default BaseTicketDto;
