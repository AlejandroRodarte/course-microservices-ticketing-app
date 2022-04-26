import { db, objects } from '@msnr-ticketing-app/common';
import { NextFunction, Response } from 'express';
import Ticket from '../../db/models/ticket';
import { DbModelTypes } from '../../types/db/models';
import { MiddlewareTypes } from '../../types/middlewares';

const isTicketOwnedByUser = async (
  req: MiddlewareTypes.IsTicketOwnedByUserExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const [ticket, findTicketByIdError] = await db.helpers.findById<
    DbModelTypes.TicketDocument,
    DbModelTypes.TicketModel
  >({
    Model: Ticket,
    id,
    errorMessage: `There was an error trying to find ticket with ID ${id}`,
  });

  if (findTicketByIdError) return next(findTicketByIdError);
  if (!ticket)
    return next(
      new objects.errors.EntityNotFoundError(
        'ticket',
        `The ticket with ID ${id} was not found in the database.`
      )
    );

  if (ticket!.userId !== req['jwt/user-data']!.id)
    return next(
      new objects.errors.UnauthorizedError(
        `Ticket with ID ${id} is not owned by this user.`
      )
    );

  req.ticket = ticket;
  next();
};

export default isTicketOwnedByUser;
