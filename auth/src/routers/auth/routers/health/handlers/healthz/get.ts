import { RequestHandler } from 'express';

const get: RequestHandler = (req, res) => {
  return res.status(200).send({ message: 'OK!' });
};

export default get;
