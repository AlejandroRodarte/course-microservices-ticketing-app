import https from 'https';
import doServerSideRequest from '../do-server-side-request';
import { RequestTypes } from '../../types/requests';
import { OrdersObjectDataTypes } from '../../types/objects/data/orders';

const getOrders: RequestTypes.OrdersGetOrdersFunction = async (
  cookie?: string
) => {
  const [response, error] = await doServerSideRequest<
    undefined,
    OrdersObjectDataTypes.GetOrdersData
  >({
    endpoint: 'orders',
    microservice: 'orders',
    method: 'get',
    config: {
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        Cookie: cookie || '',
      },
    },
  });
  if (response && response.status === 200 && response.data)
    return response.data.orders;
  return null;
};

export default getOrders;
