import { OrderResourceTypes } from '@msnr-ticketing-app/common';
import { DbModelTypes } from '../../../types/db/models';
import { DtoTypes } from '../../../types/objects/dto';
import BaseTicketDto from '../tickets/base-ticket-dto';

class BaseOrderDto {
  private _id: string;
  private _userId: string;
  private _status: OrderResourceTypes.Status;
  private _expiresAt: string;
  private _version: number;
  private _ticket: BaseTicketDto;

  constructor(
    id: string,
    userId: string,
    status: OrderResourceTypes.Status,
    expiresAt: string,
    version: number,
    ticket: BaseTicketDto
  ) {
    this._id = id;
    this._userId = userId;
    this._status = status;
    this._expiresAt = expiresAt;
    this._version = version;
    this._ticket = ticket;
  }

  toJSON(): DtoTypes.IBaseOrderDto {
    return {
      id: this.id,
      userId: this.userId,
      status: this.status,
      expiresAt: this.expiresAt,
      version: this.version,
      ticket: this.ticket.toJSON(),
    };
  }

  static fromOrderDocument(orderDocument: DbModelTypes.OrderDocument) {
    return new BaseOrderDto(
      orderDocument._id,
      orderDocument.userId,
      orderDocument.status,
      orderDocument.expiresAt.toISOString(),
      orderDocument.version,
      BaseTicketDto.fromTicketDocument(orderDocument.ticket)
    );
  }

  static fromOrderDocumentArray(orderDocuments: DbModelTypes.OrderDocument[]) {
    return orderDocuments.map((orderDocument) =>
      this.fromOrderDocument(orderDocument)
    );
  }

  get id() {
    return this._id;
  }

  get userId() {
    return this._userId;
  }

  get status() {
    return this._status;
  }

  get expiresAt() {
    return this._expiresAt;
  }

  get version() {
    return this._version;
  }

  get ticket() {
    return this._ticket;
  }

  set id(id: string) {
    this._id = id;
  }

  set userId(userId: string) {
    this._userId = userId;
  }

  set status(status: OrderResourceTypes.Status) {
    this._status = status;
  }

  set expiresAt(expiresAt: string) {
    this._expiresAt = expiresAt;
  }

  set version(version: number) {
    this._version = version;
  }

  set ticket(ticket: BaseTicketDto) {
    this._ticket = ticket;
  }
}

export default BaseOrderDto;
