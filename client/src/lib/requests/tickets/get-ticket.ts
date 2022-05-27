import doServerSideRequest from '../do-server-side-request';
import { RequestTypes } from '../../types/requests';
import { TicketsObjectDataTypes } from '../../types/objects/data/tickets';

const getTicket: RequestTypes.TicketsGetTicketFunction = async (id: string) => {
  const [response, error] = await doServerSideRequest<
    undefined,
    TicketsObjectDataTypes.GetTicketData
  >({
    endpoint: `tickets/${id}`,
    microservice: 'tickets',
    method: 'get',
    config: {
      withCredentials: false,
    },
  });
  if (response && response.status === 200 && response.data)
    return response.data.ticket;
  return null;
};

export default getTicket;
