import { RequestHandler } from 'express';
import { objects } from '@msnr-ticketing-app/common';

const get: RequestHandler = (req, res) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<undefined, undefined>(
        200,
        'APPLICATION_HEALTHY',
        'The application is healthy.',
        undefined,
        undefined
      )
    );
};

export default get;
