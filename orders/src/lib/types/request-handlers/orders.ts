import { JwtTypes } from '@msnr-ticketing-app/common';
import { Request } from 'express';

export namespace OrdersRequestHandlers {
  export interface GetOrdersExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
  }
  export interface GetOrdersIdExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
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
  }
}
