import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import { OrdersRequestHandlers } from '../../../../../lib/types/request-handlers/orders';

const deleteHandler = async (
  req: OrdersRequestHandlers.DeleteOrdersIdExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        200,
        'ROUTE_FOUND',
        `Route DELETE /orders/${req.params.id} found.`,
        undefined,
        undefined
      )
    );
};

export default deleteHandler;
