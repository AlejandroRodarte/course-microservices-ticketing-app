import { DbModelTypes } from '../../types/db/models';
import { DtoTypes } from '../../types/objects/dto';

class BasePaymentDto {
  private _id: string;
  private _orderId: string;
  private _stripeId: string;

  constructor(id: string, orderId: string, stripeId: string) {
    this._id = id;
    this._orderId = orderId;
    this._stripeId = stripeId;
  }

  toJSON(): DtoTypes.IBasePaymentDto {
    return {
      id: this.id,
      orderId: this.orderId,
      stripeId: this.stripeId,
    };
  }

  static fromPaymentDocument(paymentDocument: DbModelTypes.PaymentDocument) {
    return new BasePaymentDto(
      paymentDocument._id,
      paymentDocument.orderId,
      paymentDocument.stripeId
    );
  }

  get id() {
    return this._id;
  }

  get orderId() {
    return this._orderId;
  }

  get stripeId() {
    return this._stripeId;
  }

  set id(id: string) {
    this._id = id;
  }

  set orderId(orderId: string) {
    this._orderId = orderId;
  }

  set stripeId(stripeId: string) {
    this.stripeId = stripeId;
  }
}

export default BasePaymentDto;
