import { AxiosRequestConfig } from 'axios';
import { AxiosTypes } from './axios';
import { FormTypes } from './forms';
import { ReturnTypes } from './returns';
import { UniversalObjectTypes } from './objects/universal';
import { AuthObjectDtoTypes } from './objects/dto/auth';

export namespace RequestTypes {
  /**
   * axios-related request types
   */
  export type AxiosResponse<DataType> = ReturnTypes.AsyncTuple<
    UniversalObjectTypes.ApplicationResponse<
      DataType,
      UniversalObjectTypes.UniversalError
    >,
    UniversalObjectTypes.UniversalError
  >;

  /**
   * server-side helper request function types
   */
  export type AuthCurrentUserFunction = (
    cookie?: string
  ) => Promise<AuthObjectDtoTypes.BaseUserDto | null>;

  /**
   * doServerSideRequest util function type
   */
  export interface DoServerSideRequestArgs<BodyType> {
    endpoint: string;
    microservice: AxiosTypes.MicroServices;
    method: AxiosTypes.Methods;
    config: AxiosRequestConfig;
    body?: BodyType;
  }

  /**
   * req.body type for POST /sign-up
   */
  export interface SignUpRequestBody {
    data: {
      credentials: FormTypes.CredentialsForm;
    };
  }
  /**
   * req.body type for POST /sign-in
   */
  export type SignInRequestBody = SignUpRequestBody;

  /**
   * req.body type for POST /sign-out
   */
  export interface SignOutRequestBody {}

  /**
   * req.body type for POST /tickets
   */
  export interface NewTicketBody {
    data: {
      newTicket: {
        title: string;
        price: number;
      };
    };
  }
}
