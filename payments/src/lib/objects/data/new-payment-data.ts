import { DataTypes } from '../../types/objects/data';
import BasePaymentDto from '../dto/base-payment-dto';

class NewPaymentData {
  private _newPayment: BasePaymentDto;

  constructor(newPayment: BasePaymentDto) {
    this._newPayment = newPayment;
  }

  toJSON(): DataTypes.INewPaymentData {
    return {
      newPayment: this.newPayment,
    };
  }

  get newPayment() {
    return this._newPayment;
  }

  set newPayment(newPayment: BasePaymentDto) {
    this._newPayment = newPayment;
  }
}

export default NewPaymentData;
