import mongoose from 'mongoose';
import { OrderResourceTypes } from '@msnr-ticketing-app/common';

export namespace DbModelTypes {
  /**
   * Ticket model
   */
  // attributes required to create a Ticket
  export interface TicketAttributes {
    id: string;
    orderId?: string;
  }
  // attributes related to a Ticket document (single record)
  export interface TicketDocument extends mongoose.Document {
    version: number;
    orderId?: string;
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
    id: string;
    status: OrderResourceTypes.Status;
    version: number;
    userId: string;
    price: number;
    ticket: TicketDocument;
  }
  // attributes related to a Order document (single record)
  export interface OrderDocument extends mongoose.Document {
    status: OrderResourceTypes.Status;
    version: number;
    userId: string;
    price: number;
    ticket: TicketDocument;
  }
  // extend Order model to include static methods
  export interface OrderModel extends mongoose.Model<OrderDocument> {
    build(attrs: OrderAttributes): OrderDocument;
  }

  /**
   * Payment model
   */
  // attributes required to create a Payment
  export interface PaymentAttributes {
    orderId: string;
    stripeId: string;
  }
  // attributes related to a Payment document (single record)
  export interface PaymentDocument extends mongoose.Document {
    orderId: string;
    stripeId: string;
    version: number;
  }
  // extend Payment model to include static methods
  export interface PaymentModel extends mongoose.Model<PaymentDocument> {
    build(attrs: PaymentAttributes): PaymentDocument;
  }
}
