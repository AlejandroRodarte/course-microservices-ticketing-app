import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';
import { DbModelTypes } from '../db/models';

export namespace OrdersRequestHandlers {
  export interface GetOrdersExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
  }
  export interface GetOrdersIdExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    order?: DbModelTypes.OrderDocument;
  }
  interface PostOrdersBody {
    data: {
      newOrder: {
        ticketId: string;
      };
    };
  }
  export interface PostOrdersExtendedRequest extends Request {
    body: PostOrdersBody;
    ['jwt/user-data']?: JwtTypes.UserData;
  }
  export interface DeleteOrdersIdExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
    order?: DbModelTypes.OrderDocument;
  }
}
