import { RequestHandler } from 'express';

const get: RequestHandler = (req, res) => {
  return res
    .status(200)
    .send({ message: 'Hitting route GET /auth/users/current-user.' });
};

export default get;
