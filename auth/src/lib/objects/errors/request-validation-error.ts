import { ValidationError } from 'express-validator';
import { REQUEST_VALIDATION_ERROR } from '../../constants/objects/errors';

class RequestValidationError extends Error {
  public readonly type = REQUEST_VALIDATION_ERROR;
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
}

export default RequestValidationError;
