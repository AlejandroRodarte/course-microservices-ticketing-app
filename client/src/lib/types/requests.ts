import ApplicationResponse from '../objects/application-response';
import SignUpData from '../objects/data/auth/sign-up-data';
import UniversalError from '../objects/universal-error';
import { FormTypes } from './forms';
import { ReturnTypes } from './returns';

export namespace RequestTypes {
  type AxiosResponse<DataType> = ReturnTypes.AsyncTuple<
    ApplicationResponse<DataType, UniversalError>,
    UniversalError
  >;
  export type AuthSignUpFunction = (
    form: FormTypes.SignUpForm
  ) => AxiosResponse<SignUpData>;
  export type AuthSignOutFunction = () => AxiosResponse<undefined>;
}
