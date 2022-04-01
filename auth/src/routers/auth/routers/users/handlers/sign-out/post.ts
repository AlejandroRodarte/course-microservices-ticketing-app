import { RequestHandler } from 'express';
import ApplicationResponse from '../../../../../../lib/objects/application-response';

const post: RequestHandler = (req, res) => {
  req.session = null;
  return res
    .status(200)
    .send(
      new ApplicationResponse<undefined, undefined>(
        204,
        'USER_LOGGED_OUT',
        'The user has logged out succesfully',
        undefined,
        undefined
      )
    );
};

export default post;
