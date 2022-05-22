import { objects } from '@msnr-ticketing-app/common';
import { NextFunction, Response } from 'express';
import { MiddlewareTypes } from '../../types/middlewares';

const isTicketUnreserved = async (
  req: MiddlewareTypes.IsTicketUnreservedExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.ticket!.orderId)
    throw new objects.errors.BadEntityError(
      'ticket',
      `Ticket with ID ${
        req.ticket!.id
      } can not be edited as it is currently reserved by order with ID ${
        req.ticket!.orderId
      }.`
    );
  next();
};

export default isTicketUnreserved;
