import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import { TicketsRequestHandlers } from '../../../../../lib/types/request-handlers/tickets';
import UpdateTicketData from '../../../../../lib/objects/data/update-ticket-data';
import BaseTicketDto from '../../../../../lib/objects/dto/base-ticket-dto';
import stanSingleton from '../../../../../lib/objects/nats/stan-singleton';
import TicketUpdatedPublisher from '../../../../../lib/objects/nats/publishers/ticket-updated-publisher';

const put = async (
  req: TicketsRequestHandlers.PutTicketsIdExtendedRequest,
  res: Response
) => {
  const [updatedTicket, updateError] = await req.ticket!.updateFields(
    req.body.data.ticketUpdates
  );
  if (updateError) throw updateError;

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) throw stanUnconnectedError;

  console.log(
    `[tickets] NATS client ${process.env.NATS_CLIENT_ID} emitting event to ticket:updated channel.`
  );
  const natsError = await new TicketUpdatedPublisher(stan!).publish({
    id: updatedTicket.id,
    title: updatedTicket.title,
    price: updatedTicket.price,
    userId: updatedTicket.userId,
    version: updatedTicket.version,
    orderId: updatedTicket.orderId,
  });

  if (natsError) throw natsError;

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
