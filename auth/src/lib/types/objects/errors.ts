import DatabaseConnectionError from '../../objects/errors/database-connection-error';
import RequestValidationError from '../../objects/errors/request-validation-error';

export namespace ErrorObjectTypes {
  export type ErrorType = DatabaseConnectionError | RequestValidationError;

  export interface UniversalErrorItem {
    message: string;
    field?: string;
  }
}
