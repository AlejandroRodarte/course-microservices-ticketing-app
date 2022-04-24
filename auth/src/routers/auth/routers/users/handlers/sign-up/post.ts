import { Response } from 'express';
import { objects, jwt, db } from '@msnr-ticketing-app/common';

import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';
import User from '../../../../../../lib/db/models/user';
import SignUpData from '../../../../../../lib/objects/data/users/sign-up-data';
import BaseUserDto from '../../../../../../lib/objects/dto/users/base-user-dto';
import { DbModelTypes } from '../../../../../../lib/types/db/models';

const post = async (
  req: UsersRequestHandlers.PostSignUpExtendedRequest,
  res: Response
) => {
  const { credentials } = req.body.data;
  const [userExists, userExistsOperationError] = await db.helpers.exists<
    DbModelTypes.UserDocument,
    DbModelTypes.UserModel
  >({
    Model: User,
    filters: {
      email: credentials.email,
    },
    errorMessage:
      'An error occured while trying to check that the user existed in the database.',
  });

  if (typeof userExists === 'undefined' && userExistsOperationError)
    throw userExistsOperationError;
  if (userExists)
    throw new objects.errors.BadEntityError(
      'user',
      'There is already a user with that email registered in the database.'
    );

  const user = User.build(credentials);
  const [savedUser, userSaveOperationError] =
    await db.helpers.save<DbModelTypes.UserDocument>({
      document: user,
      errorMessage: 'There was a problem saving the user into the database.',
    });

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
