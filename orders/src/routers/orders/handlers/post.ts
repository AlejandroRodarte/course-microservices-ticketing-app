import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import { OrdersRequestHandlers } from '../../../lib/types/request-handlers/orders';

const post = async (
  req: OrdersRequestHandlers.PostOrdersExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        200,
        'ROUTE_FOUND',
        'Route POST /orders found.',
        undefined,
        undefined
      )
    );
};

export default post;
