import { DATABASE_OPERATION_ERROR } from '../../constants/objects/errors';
import { ErrorObjectTypes } from '../../types/objects/errors';
import ApplicationResponse from '../application-response';
import CustomError from './custom-error';
import UniversalError from './universal-error';

class DatabaseOperationError extends CustomError {
  public readonly type = DATABASE_OPERATION_ERROR;
  status: number = 500;
  code: string = 'DATABASE_OPERATION_ERROR';
  message: string =
    'There was a problem performing an operation in the database.';
  private _operation: ErrorObjectTypes.DatabaseOperationErrorTypes;
  private _reason: string;

  constructor(
    operation: ErrorObjectTypes.DatabaseOperationErrorTypes,
    reason: string
  ) {
    super();
    this._operation = operation;
    this._reason = reason;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, DatabaseOperationError.prototype);
  }

  toApplicationResponse(): ApplicationResponse<undefined, UniversalError> {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] = [
      {
        message: this.reason,
        field: this.operation,
      },
    ];
    const universalError = new UniversalError(this.type, formattedErrors);

    return new ApplicationResponse(
      this.status,
      this.code,
      this.message,
      undefined,
      universalError
    );
  }

  get reason() {
    return this._reason;
  }

  get operation() {
    return this._operation;
  }
}

export default DatabaseOperationError;
