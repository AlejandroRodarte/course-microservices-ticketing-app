import { ROUTE_NOT_FOUND_ERROR } from '../../constants/objects/errors';
import ApplicationResponse from '../application-response';
import CustomError from './custom-error';
import UniversalError from './universal-error';

class RouteNotFoundError extends CustomError {
  type: string = ROUTE_NOT_FOUND_ERROR;
  status: number = 404;
  code: string = 'ROUTE_NOT_FOUND';
  message: string = 'The requested endpoint does not exist.';

  constructor() {
    super();
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, RouteNotFoundError.prototype);
  }

  toApplicationResponse(): ApplicationResponse<undefined, UniversalError> {
    const universalError = new UniversalError(this.type, [
      { message: 'Route not found.' },
    ]);
    return new ApplicationResponse<undefined, UniversalError>(
      this.status,
      this.code,
      this.message,
      undefined,
      universalError
    );
  }
}

export default RouteNotFoundError;
