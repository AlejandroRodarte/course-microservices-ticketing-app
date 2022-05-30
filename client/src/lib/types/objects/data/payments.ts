import { PaymentsObjectDtoTypes } from '../dto/payments';

export namespace PaymentsObjectDataTypes {
  export interface NewPaymentData {
    newPayment: PaymentsObjectDtoTypes.BasePaymentDto;
  }
}
