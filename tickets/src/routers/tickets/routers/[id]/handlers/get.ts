import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import { TicketsRequestHandlers } from '../../../../../lib/types/request-handlers/tickets';

const get = (
  req: TicketsRequestHandlers.GetTicketsIdExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        200,
        'ROUTE_FOUND',
        `Route GET /tickets/${req.params.id} found.`,
        undefined,
        undefined
      )
    );
};

export default get;
