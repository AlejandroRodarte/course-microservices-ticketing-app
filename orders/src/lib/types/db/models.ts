import mongoose from 'mongoose';
import { OrderResourceTypes } from '@msnr-ticketing-app/common';

export namespace DbModelTypes {
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
    ticket: TicketDocument;
  }
  // extend Order model to include static methods
  export interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttributes): OrderDocument;
  }
}
