import { Response } from 'express';
import { validationResult } from 'express-validator';

import RequestValidationError from '../../../../../../lib/objects/errors/request-validation-error';
import DatabaseConnectionError from '../../../../../../lib/objects/errors/database-connection-error';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';

const post = (req: UsersRequestHandlers.PostSignUpExtendedRequest, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());
  throw new DatabaseConnectionError('Error connecting to the database.');

  return res
    .status(200)
    .send({ message: 'Hitting route POST /auth/users/sign-up.' });
};

export default post;
