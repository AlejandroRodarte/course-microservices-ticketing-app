import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from '../db/models';

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

  interface PutTicketsIdBody {
    data: {
      ticketUpdates: Partial<{
        title: string;
        price: number;
      }>;
    };
  }
  export interface PutTicketsIdExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    ticket?: DbModelTypes.TicketDocument;
    body: PutTicketsIdBody;
  }
}
