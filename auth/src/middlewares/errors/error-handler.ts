import { ErrorRequestHandler } from 'express';
import ApplicationResponse from '../../lib/objects/application-response';
import UniversalError from '../../lib/objects/errors/universal-error';
import CustomError from '../../lib/objects/errors/custom-error';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof CustomError)
    return res
      .status(200)
      .send(
        new ApplicationResponse<undefined, UniversalError>(
          err.status,
          err.code,
          err.message,
          undefined,
          err.serialize()
        )
      );
  return res
    .status(200)
    .send(
      new ApplicationResponse<undefined, undefined>(
        400,
        'GENERIC_ERROR',
        'Something went wrong with the application.',
        undefined,
        undefined
      )
    );
};

export default errorHandler;
