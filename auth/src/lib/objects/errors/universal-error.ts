import DatabaseConnectionError from './database-connection-error';
import RequestValidationError from './request-validation-error';
import { ErrorObjectTypes } from '../../types/objects/errors';

class UniversalError {
  private type: string;
  private errors: ErrorObjectTypes.UniversalErrorItem[];

  constructor(type: string, errors: ErrorObjectTypes.UniversalErrorItem[]) {
    this.type = type;
    this.errors = errors;
  }

  static mapFromDatabaseConnectionError(
    databaseConnectionError: DatabaseConnectionError
  ) {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] = [
      {
        message: databaseConnectionError.reason,
      },
    ];

    return new UniversalError(databaseConnectionError.type, formattedErrors);
  }

  static mapFromRequestValidationError(
    requestValidationError: RequestValidationError
  ) {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] =
      requestValidationError.errors.map((error) => ({
        message: error.msg,
        field: error.param,
      }));

    return new UniversalError(requestValidationError.type, formattedErrors);
  }
}

export default UniversalError;
