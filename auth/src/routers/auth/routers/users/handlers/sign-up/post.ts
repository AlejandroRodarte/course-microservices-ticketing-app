import { Response } from 'express';
import { validationResult, ValidationError } from 'express-validator';

import ApplicationResponse from '../../../../../../lib/objects/application-response';
import commonResponses from '../../../../../../lib/constants/responses/common';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';

const post = (req: UsersRequestHandlers.PostSignUpExtendedRequest, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw new Error('Invalid email or password');

  throw new Error('Error conecting to the database');

  return res
    .status(200)
    .send({ message: 'Hitting route POST /auth/users/sign-up.' });
};

export default post;
