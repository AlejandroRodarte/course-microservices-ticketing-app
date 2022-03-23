import { Request } from 'express';

export namespace UsersRequestHandlers {
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
}
