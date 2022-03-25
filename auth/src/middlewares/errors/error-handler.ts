import { ErrorRequestHandler } from 'express';
import ApplicationResponse from '../../lib/objects/application-response';
import UniversalError from '../../lib/objects/errors/universal-error';
import { ErrorObjectTypes } from '../../lib/types/objects/errors';
import * as ErrorTypes from '../../lib/constants/objects/errors';
import errorApplicationResponseDictionary from '../../lib/constants/responses/errors';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err as ErrorObjectTypes.ErrorType;
  const applicationResponseData =
    errorApplicationResponseDictionary[error.type];

  let universalError: UniversalError | undefined = undefined;

  switch (error.type) {
    case ErrorTypes.REQUEST_VALIDATION_ERROR: {
      universalError = UniversalError.mapFromRequestValidationError(error);
      break;
    }
    case ErrorTypes.DATABASE_CONNECTION_ERROR: {
      universalError = UniversalError.mapFromDatabaseConnectionError(error);
      break;
    }
    default: {
      universalError = new UniversalError('GENERIC_ERROR', [
        { message: 'Something went wrong with the application.' },
      ]);
    }
  }

  const applicationResponse = new ApplicationResponse<
    undefined,
    UniversalError
  >(
    applicationResponseData.status,
    applicationResponseData.code,
    applicationResponseData.message,
    undefined,
    universalError
  );

  return res.status(200).send(applicationResponse);
};

export default errorHandler;
