import { ResponsesConstants } from '../../types/constants/responses';

const common: ResponsesConstants.ApplicationResponseDataDictionary = {
  validationError: {
    status: 422,
    code: 'VALIDATION_ERROR',
    message: 'There were validation errors found in the request body.',
  },
};

export default common;
