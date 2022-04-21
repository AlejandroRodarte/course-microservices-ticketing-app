import { RequestHandler } from 'express';
import { objects } from '@msnr-ticketing-app/common';

const post: RequestHandler = (req, res) => {
  req.session = null;
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        204,
        'USER_LOGGED_OUT',
        'The user has logged out succesfully',
        undefined,
        undefined
      )
    );
};

export default post;
