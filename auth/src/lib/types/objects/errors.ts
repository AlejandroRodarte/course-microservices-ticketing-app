import DatabaseConnectionError from '../../objects/errors/database-connection-error';
import RequestValidationError from '../../objects/errors/request-validation-error';
import UniversalError from '../../objects/errors/universal-error';

export namespace ErrorObjectTypes {
  export type ErrorType = DatabaseConnectionError | RequestValidationError;

  export interface UniversalErrorItem {
    message: string;
    field?: string;
  }

  export interface Serializable {
    serialize(): UniversalError;
  }
}
