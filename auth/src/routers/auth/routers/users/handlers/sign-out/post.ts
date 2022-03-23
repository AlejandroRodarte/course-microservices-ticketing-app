import { RequestHandler } from 'express';

const post: RequestHandler = (req, res) => {
  return res
    .status(200)
    .send({ message: 'Hitting route POST /auth/users/sign-out.' });
};

export default post;
