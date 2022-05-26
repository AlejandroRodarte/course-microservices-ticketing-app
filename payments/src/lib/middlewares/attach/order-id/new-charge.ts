import { NextFunction, Response } from 'express';
import { MiddlewareTypes } from '../../../types/middlewares';

const newCharge = async (
  req: MiddlewareTypes.AttachOrderIdNewChargeExtendedRequest,
  res: Response,
  next: NextFunction
) => {
  req['order/id'] = req.body.data.newCharge.orderId;
  next();
};

export default newCharge;
