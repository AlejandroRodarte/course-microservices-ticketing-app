import { AxiosRequestConfig } from 'axios';
import { AxiosTypes } from './axios';
import { RequestTypes } from './requests';

export namespace HooksTypes {
  export interface UseRequestArgs {
    endpoint: string;
    microservice: AxiosTypes.MicroServices;
    method: AxiosTypes.Methods;
    config: AxiosRequestConfig;
  }

  export interface UseRequestReturns<BodyType, DataType> {
    doRequest: (body: BodyType) => RequestTypes.AxiosResponse<DataType>;
    errors: JSX.Element | undefined;
  }
}
