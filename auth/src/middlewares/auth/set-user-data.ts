import { NextFunction, Response } from 'express';
import jwt from '../../lib/jwt';
import UnauthorizedError from '../../lib/objects/errors/unauthorized-error';
import { JwtTypes } from '../../lib/types/jwt';
import { MiddlewareTypes } from '../../lib/types/middlewares';

const setUserData = (
  req: MiddlewareTypes.VerifyTokenExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt)
    return next(new UnauthorizedError('There is no token in the request.'));

  const [payload, badTokenError] = jwt.verify(req.session.jwt);
  if (typeof payload === 'undefined' && badTokenError)
    return next(new UnauthorizedError(badTokenError.reason));

  req['jwt/user-data'] = payload as JwtTypes.UserData;
  next();
};

export default setUserData;
