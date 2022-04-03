import { RequestHandler } from 'express';
import ApplicationResponse from '../../../../../../lib/objects/application-response';

const get: RequestHandler = (req, res) => {
  return res
    .status(200)
    .send(
      new ApplicationResponse<undefined, undefined>(
        200,
        'APPLICATION_HEALTHY',
        'The application is healthy.',
        undefined,
        undefined
      )
    );
};

export default get;
