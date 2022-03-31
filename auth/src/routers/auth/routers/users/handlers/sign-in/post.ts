import { Response } from 'express';
import bcrypt from '../../../../../../lib/bcrypt';
import helpers from '../../../../../../lib/db/helpers';
import jwt from '../../../../../../lib/jwt';
import ApplicationResponse from '../../../../../../lib/objects/application-response';
import SignInData from '../../../../../../lib/objects/data/users/sign-in-data';
import BaseUserDto from '../../../../../../lib/objects/dto/users/base-user-dto';
import BadCredentialsError from '../../../../../../lib/objects/errors/bad-credentials-error';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';

const post = async (
  req: UsersRequestHandlers.PostSignInExtendedRequest,
  res: Response
) => {
  const { credentials } = req.body.data;

  const [user, databaseOperationError] = await helpers.user.findOne({
    email: credentials.email,
  });
  if (typeof user === 'undefined' && databaseOperationError)
    throw databaseOperationError;
  if (!user) throw new BadCredentialsError('Wrong credentials.');

  const [arePasswordsEqual, bcryptLibraryError] = await bcrypt.compare(
    user.password,
    credentials.password
  );
  if (typeof arePasswordsEqual === 'undefined' && bcryptLibraryError)
    throw bcryptLibraryError;
  if (!arePasswordsEqual) throw new BadCredentialsError('Wrong credentials.');

  req.session = {
    jwt: jwt.sign({
      id: user.id,
      email: user.email,
    }),
  };

  return res
    .status(200)
    .send(
      new ApplicationResponse<SignInData, undefined>(
        200,
        'USER_LOGGED_IN',
        'The user has logged in succesfully.',
        new SignInData(BaseUserDto.fromUserDocument(user)),
        undefined
      )
    );
};

export default post;
