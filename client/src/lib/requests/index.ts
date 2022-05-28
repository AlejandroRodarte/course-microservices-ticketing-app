import auth from './auth';
import tickets from './tickets';
import orders from './orders';
import doServerSideRequest from './do-server-side-request';

const requests = {
  auth,
  doServerSideRequest,
  tickets,
  orders,
};

export default requests;
