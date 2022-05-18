import get from './get';
import deleteHandler from './delete';

const handlers = {
  get,
  delete: deleteHandler,
};

export default handlers;
