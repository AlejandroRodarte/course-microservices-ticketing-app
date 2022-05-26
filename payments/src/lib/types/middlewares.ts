import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from './db/models';

export namespace MiddlewareTypes {
  export interface IsOrderOwnedByUserExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    order?: DbModelTypes.OrderDocument;
  }
}
