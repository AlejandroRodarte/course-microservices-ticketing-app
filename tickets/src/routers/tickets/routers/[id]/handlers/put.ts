import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import { TicketsRequestHandlers } from '../../../../../lib/types/request-handlers/tickets';
import UpdateTicketData from '../../../../../objects/data/update-ticket-data';
import BaseTicketDto from '../../../../../objects/dto/base-ticket-dto';

const put = async (
  req: TicketsRequestHandlers.PutTicketsIdExtendedRequest,
  res: Response
) => {
  const [updatedTicket, updateError] = await req.ticket!.updateFields(
    req.body.data.ticketUpdates
  );
  if (updateError) throw updateError;

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<UpdateTicketData, undefined>(
        204,
        'TICKET_UPDATED',
        `Ticket ${req.params.id} updated succesfully.`,
        new UpdateTicketData(BaseTicketDto.fromTicketDocument(updatedTicket!)),
        undefined
      )
    );
};

export default put;
