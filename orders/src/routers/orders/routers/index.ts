import health from './health';
import _id from './[id]';

const routers = {
  health,
  ':id': _id,
};

export default routers;
