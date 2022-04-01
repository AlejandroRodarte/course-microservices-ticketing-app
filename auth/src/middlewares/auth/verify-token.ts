import { NextFunction, Response } from 'express';
import jwt from '../../lib/jwt';
import BadTokenError from '../../lib/objects/errors/bad-token-error';
import { JwtTypes } from '../../lib/types/jwt';
import { MiddlewareTypes } from '../../lib/types/middlewares';

const verifyToken = (
  req: MiddlewareTypes.VerifyTokenExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt)
    return next(new BadTokenError('There is no token in the request.'));

  const [payload, badTokenError] = jwt.verify(req.session.jwt);
  if (typeof payload === 'undefined' && badTokenError)
    return next(badTokenError);

  req['jwt/user-data'] = payload as JwtTypes.UserData;
  next();
};

export default verifyToken;
