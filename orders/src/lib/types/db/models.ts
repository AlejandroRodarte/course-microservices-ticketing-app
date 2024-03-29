import mongoose from 'mongoose';
import {
  objects,
  OrderResourceTypes,
  ReturnTypes,
} from '@msnr-ticketing-app/common';

export namespace DbModelTypes {
  /**
   * Ticket model
   */
  // attributes required to create a Ticket
  export interface TicketAttributes {
    id: string;
    title: string;
    price: number;
  }
  // attributes related to a Ticket document (single record)
  export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<
      ReturnTypes.AsyncTuple<
        boolean,
        InstanceType<typeof objects.errors.DatabaseOperationError>
      >
    >;
  }
  // extend Ticket model to include static methods
  export interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttributes): TicketDocument;
  }

  /**
   * Order model
   */
  // attributes required to create a Order
  export interface OrderAttributes {
    userId: string;
    status: OrderResourceTypes.Status;
    expiresAt: Date;
    ticket: TicketDocument;
  }
  // attributes related to a Order document (single record)
  export interface OrderDocument extends mongoose.Document {
    userId: string;
    status: OrderResourceTypes.Status;
    expiresAt: Date;
    version: number;
    ticket: TicketDocument;
  }
  // extend Order model to include static methods
  export interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttributes): OrderDocument;
  }
}
