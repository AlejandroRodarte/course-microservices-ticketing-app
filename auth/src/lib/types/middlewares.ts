import { Request } from 'express';
import { JwtTypes } from './jwt';

export namespace MiddlewareTypes {
  export interface VerifyTokenExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
  }
}
