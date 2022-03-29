import { ENTITY_NOT_FOUND_ERROR } from '../../constants/objects/errors';
import { ErrorObjectTypes } from '../../types/objects/errors';
import ApplicationResponse from '../application-response';
import CustomError from './custom-error';
import UniversalError from './universal-error';

class EntityNotFoundError extends CustomError {
  public readonly type = ENTITY_NOT_FOUND_ERROR;
  status: number = 404;
  code: string = 'ENTITY_NOT_FOUND_ERROR';
  message: string = 'There was a problem finding an entity in the database.';
  private _entity: ErrorObjectTypes.EntityErrorTypes;
  private _reason: string;

  constructor(
    entity: ErrorObjectTypes.EntityErrorTypes,
    reason: string
  ) {
    super();
    this._entity = entity;
    this._reason = reason;
    // only because we are extending a built-in class
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }

  toApplicationResponse(): ApplicationResponse<undefined, UniversalError> {
    const formattedErrors: ErrorObjectTypes.UniversalErrorItem[] = [
      {
        message: this.reason,
        field: this.entity,
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

  get entity() {
    return this._entity;
  }
}

export default EntityNotFoundError;
