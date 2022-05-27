import doServerSideRequest from '../do-server-side-request';
import { RequestTypes } from '../../types/requests';
import { TicketsObjectDataTypes } from '../../types/objects/data/tickets';

const getTickets: RequestTypes.TicketsGetTicketsFunction = async () => {
  const [response, error] = await doServerSideRequest<
    undefined,
    TicketsObjectDataTypes.GetTicketsData
  >({
    endpoint: 'tickets',
    microservice: 'tickets',
    method: 'get',
    config: {
      withCredentials: false,
    },
  });
  if (response && response.status === 200 && response.data)
    return response.data.tickets;
  return null;
};

export default getTickets;
