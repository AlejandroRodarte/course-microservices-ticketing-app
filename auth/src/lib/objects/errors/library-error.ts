import { LIBRARY_ERROR } from '../../constants/objects/errors';
import { ErrorObjectTypes } from '../../types/objects/errors';
import ApplicationResponse from '../application-response';
import CustomError from './custom-error';
import UniversalError from './universal-error';

class LibraryError extends CustomError {
  public readonly type = LIBRARY_ERROR;
  status: number = 500;
  code: string = 'LIBRARY_ERROR';
  message: string =
    'There was a problem with one of the third-party libraries.';
  private _library: ErrorObjectTypes.LibraryErrorTypes;
  private _reason: string;

  constructor(library: ErrorObjectTypes.LibraryErrorTypes, reason: string) {
    super();
    this._library = library;
    this._reason = reason;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, LibraryError.prototype);
  }

  toApplicationResponse(): ApplicationResponse<undefined, UniversalError> {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] = [
      {
        message: this.reason,
        field: this.library,
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

  get library() {
    return this._library;
  }
}

export default LibraryError;
