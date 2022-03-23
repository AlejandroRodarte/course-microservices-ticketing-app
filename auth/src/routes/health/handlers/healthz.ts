import { RequestHandler } from 'express';

const healthz: RequestHandler = (req, res) => {
  return res.send({ message: 'OK!' });
};

export default healthz;