import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Ticket from '../../../../../lib/db/models/ticket';
import { DbModelTypes } from '../../../../../lib/types/db/models';
import { TicketsRequestHandlers } from '../../../../../lib/types/request-handlers/tickets';
import ShowTicketData from '../../../../../objects/data/show-ticket-data';
import BaseTicketDto from '../../../../../objects/dto/base-ticket-dto';

const get = async (
  req: TicketsRequestHandlers.GetTicketsIdExtendedRequest,
  res: Response
) => {
  const { id } = req.params;

  const [ticket, findTicketByIdError] = await db.helpers.findById<
    DbModelTypes.TicketDocument,
    DbModelTypes.TicketModel
  >({
    Model: Ticket,
    id,
    errorMessage: `There was a problem finding the ticket with ID ${id}.`,
  });

  if (findTicketByIdError) throw findTicketByIdError;
  if (!ticket)
    throw new objects.errors.EntityNotFoundError(
      'ticket',
      `Ticket with ID ${id} was not found in the database.`
    );

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<ShowTicketData, undefined>(
        200,
        'TICKET_FOUND',
        `Ticket with ID ${id} fetched succesfully from the database.`,
        new ShowTicketData(BaseTicketDto.fromTicketDocument(ticket)),
        undefined
      )
    );
};

export default get;
