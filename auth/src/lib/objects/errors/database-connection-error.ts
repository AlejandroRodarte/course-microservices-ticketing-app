import { DATABASE_CONNECTION_ERROR } from '../../constants/objects/errors';

class DatabaseConnectionError extends Error {
  public readonly type = DATABASE_CONNECTION_ERROR;
  private _reason: string;

  constructor(reason: string) {
    super();
    this._reason = reason;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  get reason() {
    return this._reason;
  }
}

export default DatabaseConnectionError;
