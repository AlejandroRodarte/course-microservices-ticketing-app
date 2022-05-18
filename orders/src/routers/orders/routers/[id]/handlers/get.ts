import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import { OrdersRequestHandlers } from '../../../../../lib/types/request-handlers/orders';

const get = async (
  req: OrdersRequestHandlers.GetOrdersIdExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        200,
        'ROUTE_FOUND',
        `Route GET /orders/${req.params.id} found.`,
        undefined,
        undefined
      )
    );
};

export default get;
