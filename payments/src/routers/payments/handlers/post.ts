import ApplicationResponse from '@msnr-ticketing-app/common/build/lib/objects/application-response';
import { Response } from 'express';
import { PaymentsRequestHandlers } from '../../../lib/types/request-handlers/payments';

const post = async (
  req: PaymentsRequestHandlers.PostPaymentExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new ApplicationResponse<undefined, undefined>(
        200,
        'ROUTE_FOUND',
        'Route POST /payments.',
        undefined,
        undefined
      )
    );
};

export default post;
