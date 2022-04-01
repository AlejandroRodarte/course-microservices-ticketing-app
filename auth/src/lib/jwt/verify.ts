import jwt from 'jsonwebtoken';
import BadTokenError from '../objects/errors/bad-token-error';
import { JwtTypes } from '../types/jwt';

const verify: JwtTypes.VerifyFunction = (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return [payload, undefined];
  } catch (e) {
    return [
      undefined,
      new BadTokenError('The authentication token has been tampered.'),
    ];
  }
};

export default verify;
