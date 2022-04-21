import { AxiosRequestConfig } from 'axios';
import ApplicationResponse from '../objects/application-response';
import BaseUserDto from '../objects/dto/auth/base-user-dto';
import UniversalError from '../objects/universal-error';
import { AxiosTypes } from './axios';
import { FormTypes } from './forms';
import { ReturnTypes } from './returns';

export namespace RequestTypes {
  export type AxiosResponse<DataType> = ReturnTypes.AsyncTuple<
    ApplicationResponse<DataType, UniversalError>,
    UniversalError
  >;
  export type AuthCurrentUserFunction = (
    cookie?: string
  ) => Promise<BaseUserDto | null>;
  export interface SignUpRequestBody {
    data: {
      credentials: FormTypes.CredentialsForm;
    };
  }
  export type SignInRequestBody = SignUpRequestBody;
  export interface SignOutRequestBody {}
  export interface DoServerSideRequestArgs<BodyType> {
    endpoint: string;
    microservice: AxiosTypes.MicroServices;
    method: AxiosTypes.Methods;
    config: AxiosRequestConfig;
    body?: BodyType;
  }
}
