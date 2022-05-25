import { db } from '@msnr-ticketing-app/common';
import { DBHelpersTypes } from '../../../types/db/helpers';
import { DbModelTypes } from '../../../types/db/models';
import Order from '../../models/order';

async function findByEvent({
  id,
  version,
  errorMessage,
}: DBHelpersTypes.OrderFindByEventArgs): DBHelpersTypes.OrderFindByEventReturns {
  const [document, findOneDocumentError] = await db.helpers.findOne<
    DbModelTypes.OrderDocument,
    DbModelTypes.OrderModel
  >({
    Model: Order,
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
