import { RequestHandler } from 'express';

const healthz: RequestHandler = (req, res) => {
  res.send({ message: 'OK 2!' });
};

export default healthz;