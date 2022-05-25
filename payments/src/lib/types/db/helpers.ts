import {
  DBHelpersTypes as CommonDBHelperTypes,
  ReturnTypes,
  objects,
} from '@msnr-ticketing-app/common';
import { DbModelTypes } from './models';
export namespace DBHelpersTypes {
  /**
   * Ticket.findByEvent()
   */
     export type TicketFindByEventDataType =
     CommonDBHelperTypes.FindByIdDataType<DbModelTypes.TicketDocument>;
   export interface TicketFindByEventArgs {
     id: string;
     version: number;
     errorMessage: string;
   }
   export type TicketFindByEventReturns = ReturnTypes.AsyncTuple<
     TicketFindByEventDataType,
     InstanceType<typeof objects.errors.DatabaseOperationError>
   >;
  /**
   * Order.findByEvent()
   */
  export type OrderFindByEventDataType =
    CommonDBHelperTypes.FindByIdDataType<DbModelTypes.OrderDocument>;
  export interface OrderFindByEventArgs {
    id: string;
    version: number;
    errorMessage: string;
  }
  export type OrderFindByEventReturns = ReturnTypes.AsyncTuple<
    OrderFindByEventDataType,
    InstanceType<typeof objects.errors.DatabaseOperationError>
  >;
}
