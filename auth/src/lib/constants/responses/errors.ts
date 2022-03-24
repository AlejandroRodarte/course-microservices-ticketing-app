import { ResponsesConstants } from '../../types/constants/responses';
import * as ErrorTypes from '../objects/errors';

const errors: ResponsesConstants.ApplicationResponseDataDictionary = {
  [ErrorTypes.REQUEST_VALIDATION_ERROR]: {
    status: 422,
    code: 'VALIDATION_ERROR',
    message: 'There were validation errors found in the request body.',
  },
  [ErrorTypes.DATABASE_CONNECTION_ERROR]: {
    status: 500,
    code: 'DATABASE_CONNECTION_ERROR',
    message: 'Error connecting to the database.',
  },
};

export default errors;
