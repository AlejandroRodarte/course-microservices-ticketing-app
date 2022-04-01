import { BAD_TOKEN_ERROR } from '../../constants/objects/errors';
import { ErrorObjectTypes } from '../../types/objects/errors';
import ApplicationResponse from '../application-response';
import CustomError from './custom-error';
import UniversalError from './universal-error';

class BadTokenError extends CustomError {
  public readonly type = BAD_TOKEN_ERROR;
  status: number = 401;
  code: string = 'BAD_TOKEN_ERROR';
  message: string =
    'The token does not exist or failed verification procedures.';
  private _reason: string;

  constructor(reason: string) {
    super();
    this._reason = reason;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, BadTokenError.prototype);
  }

  toApplicationResponse(): ApplicationResponse<undefined, UniversalError> {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] = [
      {
        message: this.reason,
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
}

export default BadTokenError;
