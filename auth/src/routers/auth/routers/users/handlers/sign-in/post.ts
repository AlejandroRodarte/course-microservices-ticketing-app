import { Response } from 'express';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';

const post = (
  req: UsersRequestHandlers.PostSignInExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send({ message: 'Hitting route POST /auth/users/sign-in.' });
};

export default post;
