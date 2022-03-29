import { Response } from 'express';
import { validationResult } from 'express-validator';

import RequestValidationError from '../../../../../../lib/objects/errors/request-validation-error';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';
import helpers from '../../../../../../lib/db/helpers';
import User from '../../../../../../lib/db/models/user';
import BadEntityError from '../../../../../../lib/objects/errors/bad-entity-error';

const post = async (
  req: UsersRequestHandlers.PostSignUpExtendedRequest,
  res: Response
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) throw new RequestValidationError(errors.array());

  const { credentials } = req.body.data;
  const [userExists, userExistsOperationError] = await helpers.user.exists({
    email: credentials.email,
  });

  if (typeof userExists === 'undefined' && userExistsOperationError)
    throw userExistsOperationError;
  if (userExists)
    throw new BadEntityError(
      'user',
      'There is already a user with that email registered in the database.'
    );

  const user = User.build(credentials);
  const [savedUser, userSaveOperationError] = await helpers.user.save(user);

  if (typeof savedUser === 'undefined' && userSaveOperationError)
    throw userSaveOperationError;

  return res
    .status(200)
    .send(savedUser!);
};

export default post;
