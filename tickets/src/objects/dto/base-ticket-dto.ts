import { DbModelTypes } from '../../lib/types/db/models';

interface IBaseTicketDto {
  id: string;
  title: string;
  price: number;
  userId: string;
}

class BaseTicketDto {
  private _id: string;
  private _title: string;
  private _price: number;
  private _userId: string;

  constructor(id: string, title: string, price: number, userId: string) {
    this._id = id;
    this._title = title;
    this._price = price;
    this._userId = userId;
  }

  toJSON(): IBaseTicketDto {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      userId: this.userId,
    };
  }

  static fromTicketDocument(
    ticketDocument: DbModelTypes.TicketDocument
  ): BaseTicketDto {
    return new BaseTicketDto(
      ticketDocument._id,
      ticketDocument.title,
      ticketDocument.price,
      ticketDocument.userId
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

  get userId() {
    return this._userId;
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

  set userId(userId: string) {
    this._userId = userId;
  }
}

export default BaseTicketDto;
