import { ErrorRequestHandler } from 'express';
import ApplicationResponse from '../../lib/objects/application-response';
import RequestValidationError from '../../lib/objects/errors/request-validation-error';
import DatabaseConnectionError from '../../lib/objects/errors/database-connection-error';
import { ErrorObjectTypes } from '../../lib/types/objects/errors';
import * as ErrorTypes from '../../lib/constants/objects/errors';
import errorApplicationResponseDictionary from '../../lib/constants/responses/errors';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const error = err as ErrorObjectTypes.ErrorType;
  const applicationResponseData =
    errorApplicationResponseDictionary[error.type];

  switch (error.type) {
    case ErrorTypes.REQUEST_VALIDATION_ERROR: {
      return res
        .status(200)
        .send(
          new ApplicationResponse<undefined, RequestValidationError>(
            applicationResponseData.status,
            applicationResponseData.code,
            applicationResponseData.message,
            undefined,
            error
          )
        );
    }
    case ErrorTypes.DATABASE_CONNECTION_ERROR: {
      return res
        .status(200)
        .send(
          new ApplicationResponse<undefined, DatabaseConnectionError>(
            applicationResponseData.status,
            applicationResponseData.code,
            applicationResponseData.message,
            undefined,
            error
          )
        );
    }
    default: {
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
    }
  }
};

export default errorHandler;
