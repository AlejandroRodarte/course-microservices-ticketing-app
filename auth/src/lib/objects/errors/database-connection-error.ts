import { DATABASE_CONNECTION_ERROR } from '../../constants/objects/errors';
import { ErrorObjectTypes } from '../../types/objects/errors';
import CustomError from './custom-error';
import UniversalError from './universal-error';

class DatabaseConnectionError extends CustomError {
  public readonly type = DATABASE_CONNECTION_ERROR;
  status: number = 500;
  code: string = 'DATABASE_CONNECTION_ERROR';
  message: string = 'Error connecting to the database.';
  private _reason: string;

  constructor(reason: string) {
    super();
    this._reason = reason;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serialize(): UniversalError {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] = [
      {
        message: this.reason,
      },
    ];

    return new UniversalError(this.type, formattedErrors);
  }

  get reason() {
    return this._reason;
  }
}

export default DatabaseConnectionError;
