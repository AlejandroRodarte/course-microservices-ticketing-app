import { Request } from 'express';
import { JwtTypes } from '../jwt';

export namespace UsersRequestHandlers {
  /**
   * types for POST /auth/users/sign-up
   */
  interface PostSignUpBody {
    data: {
      credentials: {
        email: string;
        password: string;
      };
    };
  }
  export interface PostSignUpExtendedRequest extends Request {
    body: PostSignUpBody;
  }

  /**
   * types for POST /auth/users/sign-in
   */
  interface PostSignInBody {
    data: {
      credentials: {
        email: string;
        password: string;
      };
    };
  }

  export interface PostSignInExtendedRequest extends Request {
    body: PostSignInBody;
  }

  export interface GetCurrentUserExtendedRequest extends Request {
    ['jwt/user-data']?: JwtTypes.UserData;
  }
}
