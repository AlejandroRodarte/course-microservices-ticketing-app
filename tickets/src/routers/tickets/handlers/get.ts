import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Ticket from '../../../lib/db/models/ticket';
import { DbModelTypes } from '../../../lib/types/db/models';
import { TicketsRequestHandlers } from '../../../lib/types/request-handlers/tickets';
import GetTicketsData from '../../../lib/objects/data/get-tickets-data';
import BaseTicketDto from '../../../lib/objects/dto/base-ticket-dto';

const get = async (
  req: TicketsRequestHandlers.GetTicketsExtendedRequest,
  res: Response
) => {
  const [tickets, findTicketsError] = await db.helpers.find<
    DbModelTypes.TicketDocument,
    DbModelTypes.TicketModel
  >({
    Model: Ticket,
    filters: {},
    errorMessage:
      'An error occured while trying to fetch the tickets from the database.',
  });

  if (findTicketsError) throw findTicketsError;

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<GetTicketsData, undefined>(
        200,
        'TICKETS_FETCHED',
        'The tickets have been succesfully fetched from the database.',
        new GetTicketsData(
          BaseTicketDto.fromTicketDocumentArray(
            tickets.filter((ticket) => !ticket.orderId)
          )
        ),
        undefined
      )
    );
};

export default get;
