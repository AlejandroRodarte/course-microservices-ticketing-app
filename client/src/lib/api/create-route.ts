import ApplicationResponse from '../objects/application-response';
import { ApiTypes } from '../types/api';

const createRoute: ApiTypes.CreateRouteFunction = () => {
  const methodHandlers: ApiTypes.MethodHandlers = {};

  const generateMethodHandlerProvider: ApiTypes.GenerateMethodHandlerProviderFunction =

      (method) =>
      (...handlers) => {
        methodHandlers[method] = async (req, res) => {
          const run: ApiTypes.RunFunction = async (index = 0) => {
            if (index === handlers.length - 1) await handlers[index](req, res);
            else await handlers[index](req, res, () => run(index + 1));
          };
          return run();
        };
      };

  const rootHandler: ApiTypes.RootHandlerFunction = async (req, res) => {
    const method = req.method?.toLowerCase() as ApiTypes.HttpVerbs;
    if (method && methodHandlers[method])
      return methodHandlers[method]!(req, res);
    return res
      .status(200)
      .send(
        new ApplicationResponse(
          404,
          'ROUTE_NOT_FOUND',
          'This route does not exist in the application.',
          undefined,
          undefined
        )
      );
  };

  return {
    get: generateMethodHandlerProvider('get'),
    post: generateMethodHandlerProvider('post'),
    put: generateMethodHandlerProvider('put'),
    patch: generateMethodHandlerProvider('patch'),
    delete: generateMethodHandlerProvider('delete'),
    rootHandler,
  };
};

export default createRoute;
