import ApplicationResponse from '../../../objects/application-response';
import { ApiTypes } from '../../../types/api';

const get: ApiTypes.HandlerFunction<
  ApiTypes.GetHealthzRequest,
  ApplicationResponse<undefined, undefined>
> = async (req, res) => {
  return res
    .status(200)
    .send(
      new ApplicationResponse(
        200,
        'APPLICATION_HEALTHY',
        'The application is currently healthy.',
        undefined,
        undefined
      )
    );
};

export default get;
