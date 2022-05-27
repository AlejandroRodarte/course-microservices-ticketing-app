import { DbModelTypes } from '../../types/db/models';

interface IBaseTicketDto {
  id: string;
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
}

class BaseTicketDto {
  private _id: string;
  private _title: string;
  private _price: number;
  private _userId: string;
  private _version: number;
  private _orderId?: string;

  constructor(
    id: string,
    title: string,
    price: number,
    userId: string,
    version: number,
    orderId?: string
  ) {
    this._id = id;
    this._title = title;
    this._price = price;
    this._userId = userId;
    this._version = version;
    this._orderId = orderId;
  }

  toJSON(): IBaseTicketDto {
    return {
      id: this.id,
      title: this.title,
      price: this.price,
      userId: this.userId,
      version: this.version,
      orderId: this.orderId === 'undefined' ? undefined : this.orderId,
    };
  }

  static fromTicketDocument(
    ticketDocument: DbModelTypes.TicketDocument
  ): BaseTicketDto {
    return new BaseTicketDto(
      ticketDocument._id,
      ticketDocument.title,
      ticketDocument.price,
      ticketDocument.userId,
      ticketDocument.version,
      ticketDocument.orderId
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

  get version() {
    return this._version;
  }

  get orderId() {
    if (!this._orderId) return 'undefined';
    return this._orderId;
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

  set version(version: number) {
    this._version = version;
  }

  set orderId(orderId: string) {
    this._orderId = orderId;
  }
}

export default BaseTicketDto;
