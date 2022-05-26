export namespace RequestHandlerBodyTypes {
  export interface PostPaymentBody {
    data: {
      newCharge: {
        token: string;
        orderId: string;
      };
    };
  }
}
