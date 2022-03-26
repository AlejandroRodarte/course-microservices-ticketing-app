import { ValidationError } from 'express-validator';
import { ErrorObjectTypes } from '../../types/objects/errors';
import { REQUEST_VALIDATION_ERROR } from '../../constants/objects/errors';
import UniversalError from './universal-error';
import CustomError from './custom-error';
import ApplicationResponse from '../application-response';

class RequestValidationError extends CustomError {
  public readonly type = REQUEST_VALIDATION_ERROR;
  status: number = 422;
  code: string = 'VALIDATION_ERROR';
  message: string = 'There were validation errors found in the request body.';
  private _errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super();
    this._errors = errors;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  get errors() {
    return this._errors;
  }

  toApplicationResponse(): ApplicationResponse<undefined, UniversalError> {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] =
      this.errors.map((error) => ({
        message: error.msg,
        field: error.param,
      }));
    const universalError = new UniversalError(this.type, formattedErrors);

    return new ApplicationResponse<undefined, UniversalError>(
      this.status,
      this.code,
      this.message,
      undefined,
      universalError
    );
  }
}

export default RequestValidationError;
