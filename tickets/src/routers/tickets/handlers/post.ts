import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Ticket from '../../../lib/db/models/ticket';
import { TicketsRequestHandlers } from '../../../lib/types/request-handlers/tickets';
import NewTicketData from '../../../lib/objects/data/new-ticket-data';
import BaseTicketDto from '../../../lib/objects/dto/base-ticket-dto';
import TicketCreatedPublisher from '../../../lib/objects/nats/publishers/ticket-created-publisher';
import stanSingleton from '../../../lib/objects/nats/stan-singleton';

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

  const [stan, stanUnconnectedError] = stanSingleton.stan;
  if (stanUnconnectedError) throw stanUnconnectedError;

  console.log(
    `[tickets] NATS client ${process.env.NATS_CLIENT_ID} emitting event to ticket:created channel.`
  );
  const natsError = await new TicketCreatedPublisher(stan!).publish({
    id: savedTicket.id,
    title: savedTicket.title,
    price: savedTicket.price,
    userId: savedTicket.userId,
    version: savedTicket.version,
  });

  if (natsError) throw natsError;

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
