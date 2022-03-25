import { ValidationError } from 'express-validator';
import { ErrorObjectTypes } from '../../types/objects/errors';
import { REQUEST_VALIDATION_ERROR } from '../../constants/objects/errors';
import UniversalError from './universal-error';

class RequestValidationError
  extends Error
  implements ErrorObjectTypes.Serializable
{
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

  serialize(): UniversalError {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] =
      this.errors.map((error) => ({
        message: error.msg,
        field: error.param,
      }));

    return new UniversalError(this.type, formattedErrors);
  }
}

export default RequestValidationError;
