import jwt from 'jsonwebtoken';
import BadTokenError from '../objects/errors/bad-token-error';

export namespace JwtTypes {
  export type SignFunction = (payload: object) => string;
  export type VerifyFunction = (
    token: string
  ) => [(string | jwt.JwtPayload) | undefined, BadTokenError | undefined];
  export interface UserData {
    id: string;
    email: string;
    iat: number;
  }
}
