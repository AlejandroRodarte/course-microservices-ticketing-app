import { ApiTypes } from '../../../types/api';
import { UniversalObjectTypes } from '../../../types/objects/universal';

const get: ApiTypes.HandlerFunction<
  ApiTypes.GetHealthzRequest,
  UniversalObjectTypes.ApplicationResponse<undefined, undefined>
> = async (req, res) => {
  return res.status(200).send({
    status: 200,
    code: 'APPLICATION_HEALTHY',
    message: 'The application is currently healthy.',
    data: undefined,
    error: undefined,
  });
};

export default get;
