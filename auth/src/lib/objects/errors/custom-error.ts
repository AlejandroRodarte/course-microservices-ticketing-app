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

  abstract serialize(): UniversalError;
}

export default CustomError;
