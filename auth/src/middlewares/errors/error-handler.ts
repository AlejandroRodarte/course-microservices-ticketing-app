import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('err: ', err);
  if (err instanceof Error) return res.status(200).send({ message: err.message });
};

export default errorHandler;
