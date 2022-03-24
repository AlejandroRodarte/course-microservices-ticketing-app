import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.log('err: ', err);
  return res.status(200).send({ message: 'Something went wrong!' });
};

export default errorHandler;
