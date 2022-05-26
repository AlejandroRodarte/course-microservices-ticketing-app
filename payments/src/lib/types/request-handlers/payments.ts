import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from '../db/models';
import { RequestHandlerBodyTypes } from './body';

export namespace PaymentsRequestHandlers {
  export interface PostPaymentExtendedRequest extends Request {
    body: RequestHandlerBodyTypes.PostPaymentBody;
    ['order/id']?: string;
    ['jwt/user-data']?: JwtTypes.UserData;
    order?: DbModelTypes.OrderDocument;
  }
}
