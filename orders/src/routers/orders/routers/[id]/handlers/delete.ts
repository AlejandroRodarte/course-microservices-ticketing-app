import { db, objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import UpdateOrderData from '../../../../../lib/objects/data/orders/update-order-data';
import BaseOrderDto from '../../../../../lib/objects/dto/orders/base-order-dto';
import { DbModelTypes } from '../../../../../lib/types/db/models';
import { OrdersRequestHandlers } from '../../../../../lib/types/request-handlers/orders';

const deleteHandler = async (
  req: OrdersRequestHandlers.DeleteOrdersIdExtendedRequest,
  res: Response
) => {
  req.order!.status = 'cancelled';

  const [updatedOrder, updateOrderError] =
    await db.helpers.save<DbModelTypes.OrderDocument>({
      document: req.order!,
      errorMessage: `There was a problem cancelling order ${req.order!.id}`,
    });
  if (updateOrderError) throw updateOrderError;

  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<UpdateOrderData, undefined>(
        204,
        'USER_ORDER_CANCELLED',
        `Order ${updatedOrder!.id} has been succesfully cancelled.`,
        new UpdateOrderData(BaseOrderDto.fromOrderDocument(updatedOrder!)),
        undefined
      )
    );
};

export default deleteHandler;
