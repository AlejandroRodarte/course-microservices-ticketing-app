import { AxiosRequestConfig } from 'axios';
import ApplicationResponse from '../objects/application-response';
import CurrentUserData from '../objects/data/auth/current-user-data';
import SignUpData from '../objects/data/auth/sign-up-data';
import UniversalError from '../objects/universal-error';
import { AxiosTypes } from './axios';
import { FormTypes } from './forms';
import { ReturnTypes } from './returns';

export namespace RequestTypes {
  export type AxiosResponse<DataType> = ReturnTypes.AsyncTuple<
    ApplicationResponse<DataType, UniversalError>,
    UniversalError
  >;
  export type AuthSignUpFunction = (
    form: FormTypes.CredentialsForm
  ) => AxiosResponse<SignUpData>;
  export type AuthSignOutFunction = () => AxiosResponse<undefined>;
  export type AuthCurrentUserFunction = (
    cookie?: string
  ) => AxiosResponse<CurrentUserData>;
  export interface SignUpRequestBody {
    data: {
      credentials: FormTypes.CredentialsForm;
    };
  }
  export interface DoServerSideRequestArgs<BodyType> {
    endpoint: string;
    microservice: AxiosTypes.MicroServices;
    method: AxiosTypes.Methods;
    config: AxiosRequestConfig;
    body?: BodyType;
  }
}
