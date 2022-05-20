import { db, objects } from '@msnr-ticketing-app/common';
import { NextFunction, Response } from 'express';
import Order from '../../db/models/order';
import { DbModelTypes } from '../../types/db/models';
import { MiddlewareTypes } from '../../types/middlewares';

const isOrderOwnedByUser = async (
  req: MiddlewareTypes.IsOrderOwnedByUserExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const [order, findOrderError] = await db.helpers.findById<
    DbModelTypes.OrderDocument,
    DbModelTypes.OrderModel
  >({
    Model: Order,
    id,
    errorMessage: `There was an error trying to find order with ID ${id}.`,
  });

  if (findOrderError) return next(findOrderError);
  if (!order)
    return next(
      new objects.errors.EntityNotFoundError(
        'order',
        `The order with ID ${id} was not found in the database.`
      )
    );

  if (order!.userId !== req['jwt/user-data']!.id)
    return next(
      new objects.errors.UnauthorizedError(
        `Order with ID ${id} is not owned by this user.`
      )
    );

  req.order = order;
  next();
};

export default isOrderOwnedByUser;
