import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from './db/models';

export namespace MiddlewareTypes {
  export interface IsTicketOwnedByUserExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    ticket?: DbModelTypes.TicketDocument;
  }
  export interface IsTicketUnreservedExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    ticket?: DbModelTypes.TicketDocument;
  }
}
