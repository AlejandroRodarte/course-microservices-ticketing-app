import { Response } from 'express';
import { objects, jwt, db } from '@msnr-ticketing-app/common';
import bcrypt from '../../../../../../lib/bcrypt';
import SignInData from '../../../../../../lib/objects/data/users/sign-in-data';
import BaseUserDto from '../../../../../../lib/objects/dto/users/base-user-dto';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';
import { DbModelTypes } from '../../../../../../lib/types/db/models';
import User from '../../../../../../lib/db/models/user';

const post = async (
  req: UsersRequestHandlers.PostSignInExtendedRequest,
  res: Response
) => {
  const { credentials } = req.body.data;
  const [user, databaseOperationError] = await db.helpers.findOne<
    DbModelTypes.UserDocument,
    DbModelTypes.UserModel
  >({
    Model: User,
    filters: {
      email: credentials.email,
    },
    errorMessage:
      'There was an error trying to find a user by its unique filter criteria.',
  });

  if (typeof user === 'undefined' && databaseOperationError)
    throw databaseOperationError;
  if (!user) throw new objects.errors.BadCredentialsError('Wrong credentials.');

  const [arePasswordsEqual, bcryptLibraryError] = await bcrypt.compare(
    user.password,
    credentials.password
  );
  if (typeof arePasswordsEqual === 'undefined' && bcryptLibraryError)
    throw bcryptLibraryError;
  if (!arePasswordsEqual)
    throw new objects.errors.BadCredentialsError('Wrong credentials.');

  req.session = {
    jwt: jwt.sign({
      payload: {
        id: user.id,
        email: user.email,
      },
      secret: process.env.JWT_SECRET!,
    }),
  };

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<SignInData, undefined>(
        200,
        'USER_LOGGED_IN',
        'The user has logged in succesfully.',
        new SignInData(BaseUserDto.fromUserDocument(user)),
        undefined
      )
    );
};

export default post;
