import { Response } from 'express';
import { objects, jwt } from '@msnr-ticketing-app/common';

import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';
import helpers from '../../../../../../lib/db/helpers';
import User from '../../../../../../lib/db/models/user';
import SignUpData from '../../../../../../lib/objects/data/users/sign-up-data';
import BaseUserDto from '../../../../../../lib/objects/dto/users/base-user-dto';

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
    throw new objects.errors.BadEntityError(
      'user',
      'There is already a user with that email registered in the database.'
    );

  const user = User.build(credentials);
  const [savedUser, userSaveOperationError] = await helpers.user.save(user);

  if (typeof savedUser === 'undefined' && userSaveOperationError)
    throw userSaveOperationError;

  req.session = {
    jwt: jwt.sign({
      payload: {
        id: savedUser!.id,
        email: savedUser!.email,
      },
      secret: process.env.JWT_SECRET!,
    }),
  };

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<SignUpData, undefined>(
        201,
        'USER_REGISTERED',
        'The user has been succesfully registered into the database.',
        new SignUpData(BaseUserDto.fromUserDocument(savedUser!)),
        undefined
      )
    );
};

export default post;
