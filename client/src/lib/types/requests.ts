import { AxiosRequestConfig } from 'axios';
import { AxiosTypes } from './axios';
import { FormTypes } from './forms';
import { ReturnTypes } from './returns';
import { UniversalObjectTypes } from './objects/universal';
import { AuthObjectDtoTypes } from './objects/dto/auth';

export namespace RequestTypes {
  export type AxiosResponse<DataType> = ReturnTypes.AsyncTuple<
    UniversalObjectTypes.ApplicationResponse<
      DataType,
      UniversalObjectTypes.UniversalError
    >,
    UniversalObjectTypes.UniversalError
  >;
  export type AuthCurrentUserFunction = (
    cookie?: string
  ) => Promise<AuthObjectDtoTypes.BaseUserDto | null>;
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
