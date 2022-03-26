import ApplicationResponse from '../application-response';
import UniversalError from './universal-error';
abstract class CustomError extends Error {
  abstract type: string;
  abstract status: number;
  abstract code: string;
  abstract message: string;

  constructor() {
    super();
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract toApplicationResponse(): ApplicationResponse<undefined, UniversalError>;
}

export default CustomError;
