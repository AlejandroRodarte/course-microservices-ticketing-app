import { AxiosRequestConfig } from 'axios';
import { AxiosTypes } from './axios';
import { FormTypes } from './forms';
import { ReturnTypes } from './returns';
import { UniversalObjectTypes } from './objects/universal';
import { AuthObjectDtoTypes } from './objects/dto/auth';
import { TicketsObjectDtoTypes } from './objects/dto/tickets';
import { OrdersObjectDtoTypes } from './objects/dto/orders';

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
   * server-side request to GET /auth/users/current-user
   */
  export type AuthCurrentUserFunction = (
    cookie?: string
  ) => Promise<AuthObjectDtoTypes.BaseUserDto | null>;

  /**
   * server-side request to GET /tickets
   */
  export type TicketsGetTicketsFunction = () => Promise<
    TicketsObjectDtoTypes.BaseTicketDto[] | null
  >;

  /**
   * server-side request to GET /tickets/:id
   */
  export type TicketsGetTicketFunction = (
    id: string
  ) => Promise<TicketsObjectDtoTypes.BaseTicketDto | null>;

  /**
   * server-side request to GET /orders/:id
   */
  export type OrdersGetOrderFunction = (
    id: string,
    cookie?: string
  ) => Promise<OrdersObjectDtoTypes.BaseOrderDto | null>;

  /**
   * server-side request to GET /orders
   */
  export type OrdersGetOrdersFunction = (
    cookie?: string
  ) => Promise<OrdersObjectDtoTypes.BaseOrderDto[] | null>;

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

  /**
   * req.body type for POST /orders
   */
  export interface NewOrderBody {
    data: {
      newOrder: {
        ticketId: string;
      };
    };
  }

  /**
   * req.body type for POST /payments
   */
  export interface NewPaymentBody {
    data: {
      newCharge: {
        token: string;
        orderId: string;
      };
    };
  }
}
