import { Request } from 'express';

export namespace TicketsRequestHandlers {
  export interface GetTicketsExtendedRequest extends Request {}
  export interface GetTicketsIdExtendedRequest extends Request {}
  export interface PostTicketsIdExtendedRequest extends Request {}
  export interface PutTicketsIdExtendedRequest extends Request {}
}
