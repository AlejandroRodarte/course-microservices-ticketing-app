import { ErrorRequestHandler } from 'express';
import ApplicationResponse from '../../lib/objects/application-response';
import UniversalError from '../../lib/objects/errors/universal-error';
import { ErrorObjectTypes } from '../../lib/types/objects/errors';
import errorApplicationResponseDictionary from '../../lib/constants/responses/errors';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err as ErrorObjectTypes.ErrorType;
  const applicationResponseData =
    errorApplicationResponseDictionary[error.type];
  return res
    .status(200)
    .send(
      new ApplicationResponse<undefined, UniversalError>(
        applicationResponseData.status,
        applicationResponseData.code,
        applicationResponseData.message,
        undefined,
        error.serialize()
      )
    );
};

export default errorHandler;
