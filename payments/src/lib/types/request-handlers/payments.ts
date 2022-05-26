import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from '../db/models';

export namespace PaymentsRequestHandlers {
  interface PostPaymentBody {
    token: string;
    orderId: string;
  }
  export interface PostPaymentExtendedRequest extends Request {
    body: PostPaymentBody;
    ['jwt/user-data']?: JwtTypes.UserData;
    order?: DbModelTypes.OrderDocument;
  }
}
