import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Ticket from '../../../lib/db/models/ticket';
import { TicketsRequestHandlers } from '../../../lib/types/request-handlers/tickets';
import NewTicketData from '../../../objects/data/new-ticket-data';
import BaseTicketDto from '../../../objects/dto/base-ticket-dto';

const post = async (
  req: TicketsRequestHandlers.PostTicketsExtendedRequest,
  res: Response
) => {
  const { newTicket } = req.body.data;
  const ticket = Ticket.build({
    ...newTicket,
    userId: req['jwt/user-data']!.id,
  });

  const [savedTicket, ticketSaveOperationError] = await db.helpers.save({
    document: ticket,
    errorMessage: 'There was a problem saving the ticket.',
  });

  if (ticketSaveOperationError) throw ticketSaveOperationError;

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<NewTicketData, undefined>(
        201,
        'NEW_TICKET_CREATED',
        'The ticket has been successfully created.',
        new NewTicketData(BaseTicketDto.fromTicketDocument(savedTicket)),
        undefined
      )
    );
};

export default post;
