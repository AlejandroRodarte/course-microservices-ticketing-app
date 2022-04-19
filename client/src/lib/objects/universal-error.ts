import { ErrorObjectTypes } from '../types/objects/errors';

class UniversalError {
  public type: string;
  public errors: ErrorObjectTypes.UniversalErrorItem[];

  constructor(type: string, errors: ErrorObjectTypes.UniversalErrorItem[]) {
    this.type = type;
    this.errors = errors;
  }
}

export default UniversalError;
