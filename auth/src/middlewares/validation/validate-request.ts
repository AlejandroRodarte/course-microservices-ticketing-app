import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import RequestValidationError from '../../lib/objects/errors/request-validation-error';

const validateRequest: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return next(new RequestValidationError(errors.array()));
  return next();
};

export default validateRequest;
