import { db } from '@msnr-ticketing-app/common';
import { DBHelpersTypes } from '../../../types/db/helpers';
import { DbModelTypes } from '../../../types/db/models';
import Ticket from '../../models/ticket';

async function findByEvent({
  id,
  version,
  errorMessage,
}: DBHelpersTypes.TicketFindByEventArgs): DBHelpersTypes.TicketFindByEventReturns {
  const [document, findOneDocumentError] = await db.helpers.findOne<
    DbModelTypes.TicketDocument,
    DbModelTypes.TicketModel
  >({
    Model: Ticket,
    filters: {
      _id: id,
      version: version - 1,
    },
    errorMessage,
  });

  if (findOneDocumentError) return [undefined, findOneDocumentError];
  return [document, undefined];
}

export default findByEvent;
