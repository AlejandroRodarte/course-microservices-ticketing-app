import { Response } from 'express';

import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';
import helpers from '../../../../../../lib/db/helpers';
import User from '../../../../../../lib/db/models/user';
import BadEntityError from '../../../../../../lib/objects/errors/bad-entity-error';
import ApplicationResponse from '../../../../../../lib/objects/application-response';
import SignUpData from '../../../../../../lib/objects/data/users/sign-up-data';
import BaseUserDto from '../../../../../../lib/objects/dto/users/base-user-dto';
import jwt from '../../../../../../lib/jwt';

const post = async (
  req: UsersRequestHandlers.PostSignUpExtendedRequest,
  res: Response
) => {
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

  req.session = {
    jwt: jwt.sign({
      id: savedUser!.id,
      email: savedUser!.email,
    }),
  };

  return res
    .status(200)
    .send(
      new ApplicationResponse<SignUpData, undefined>(
        201,
        'USER_REGISTERED',
        'The user has been succesfully registered into the database.',
        new SignUpData(BaseUserDto.fromUserDocument(savedUser!)),
        undefined
      )
    );
};

export default post;
