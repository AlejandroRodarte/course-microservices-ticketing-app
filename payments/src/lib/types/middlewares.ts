import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from './db/models';
import { RequestHandlerBodyTypes } from './request-handlers/body';

export namespace MiddlewareTypes {
  export interface IsOrderOwnedByUserExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    ['order/id']?: string;
    order?: DbModelTypes.OrderDocument;
  }
  export interface AttachOrderIdNewChargeExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    ['order/id']?: string;
    body: RequestHandlerBodyTypes.PostPaymentBody;
  }
}
