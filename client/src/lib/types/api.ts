import type { NextApiRequest, NextApiResponse } from 'next';

export namespace ApiTypes {
  /**
   * types for the createRoute() utility function
   */
  export type HandlerFunction<
    RequestType extends NextApiRequest = NextApiRequest,
    ResponseType = any
  > = (
    req: RequestType,
    res: NextApiResponse<ResponseType>,
    next?: () => Promise<void>
  ) => Promise<void>;
  export type HttpVerbs = 'get' | 'post' | 'put' | 'patch' | 'delete';
  export type MethodHandlers = { [K in HttpVerbs]?: HandlerFunction<any, any> };
  export type GenerateMethodHandlerProviderFunction = (
    method: HttpVerbs
  ) => (...handlers: HandlerFunction<any, any>[]) => void;
  export type RunFunction = (index?: number) => Promise<void>;
  export type RootHandlerFunction = (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<void>;
  export type CreateRouteFunction = () => {
    get: (...handlers: HandlerFunction<any, any>[]) => void;
    post: (...handlers: HandlerFunction<any, any>[]) => void;
    put: (...handlers: HandlerFunction<any, any>[]) => void;
    patch: (...handlers: HandlerFunction<any, any>[]) => void;
    delete: (...handlers: HandlerFunction<any, any>[]) => void;
    rootHandler: RootHandlerFunction;
  };
  /**
   * types for the GET /api/health/healthz endpoint
   */
  export interface GetHealthzRequest extends NextApiRequest {}
}
