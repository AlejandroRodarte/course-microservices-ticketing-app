import { objects } from '@msnr-ticketing-app/common';
import { Response } from 'express';
import GetOrderData from '../../../../../lib/objects/data/orders/get-order-data';
import BaseOrderDto from '../../../../../lib/objects/dto/orders/base-order-dto';
import { OrdersRequestHandlers } from '../../../../../lib/types/request-handlers/orders';

const get = async (
  req: OrdersRequestHandlers.GetOrdersIdExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<GetOrderData, undefined>(
        200,
        'USER_ORDER_FETCHED',
        `Order ${req.params.id} has been fetched succesfully from the database.`,
        new GetOrderData(BaseOrderDto.fromOrderDocument(req.order!)),
        undefined
      )
    );
};

export default get;
