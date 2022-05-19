import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import Order from '../../../lib/db/models/order';
import GetOrdersData from '../../../lib/objects/data/orders/get-orders-data';
import BaseOrderDto from '../../../lib/objects/dto/orders/base-order-dto';
import { DbModelTypes } from '../../../lib/types/db/models';
import { OrdersRequestHandlers } from '../../../lib/types/request-handlers/orders';

const get = async (
  req: OrdersRequestHandlers.GetOrdersExtendedRequest,
  res: Response
) => {
  const { id: userId, email } = req['jwt/user-data']!;

  const [orders, findOrdersError] = await db.helpers.find<
    DbModelTypes.OrderDocument,
    DbModelTypes.OrderModel
  >({
    Model: Order,
    filters: {
      userId,
    },
    errorMessage: `There was an error finding orders for user ${email}.`,
    opts: {
      populateFields: ['ticket'],
    },
  });
  if (findOrdersError) throw findOrdersError;

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<GetOrdersData, undefined>(
        200,
        'USER_ORDERS_FETCHED',
        `Orders for user ${email} have been fetched succesfully.`,
        new GetOrdersData(BaseOrderDto.fromOrderDocumentArray(orders!)),
        undefined
      )
    );
};

export default get;
