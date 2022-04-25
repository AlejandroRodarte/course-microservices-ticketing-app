import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';

export namespace TicketsRequestHandlers {
  export interface GetTicketsExtendedRequest extends Request {}
  export interface GetTicketsIdExtendedRequest extends Request {}

  interface PostTicketsBody {
    data: {
      newTicket: {
        title: string;
        price: number;
      };
    };
  }
  export interface PostTicketsExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    body: PostTicketsBody;
  }

  export interface PutTicketsExtendedRequest extends Request {}
}
