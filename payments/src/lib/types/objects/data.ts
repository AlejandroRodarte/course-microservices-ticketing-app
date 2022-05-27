import BasePaymentDto from '../../objects/dto/base-payment-dto';

export namespace DataTypes {
  export interface INewPaymentData {
    newPayment: BasePaymentDto;
  }
}
