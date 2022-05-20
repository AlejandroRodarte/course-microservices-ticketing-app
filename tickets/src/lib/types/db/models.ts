import { objects, ReturnTypes } from '@msnr-ticketing-app/common';
import mongoose from 'mongoose';

export namespace DbModelTypes {
  /**
   * Ticket model
   */
  // attributes required to create a Ticket
  export interface TicketAttributes {
    title: string;
    price: number;
    userId: string;
  }
  // attributes related to a Ticket document (single record)
  export interface TicketDocument extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    updateFields: (
      attrs: Partial<TicketAttributes>
    ) => ReturnTypes.AsyncTuple<
      TicketDocument,
      InstanceType<typeof objects.errors.DatabaseOperationError>
    >;
  }
  // extend Ticket model to include static methods
  export interface TicketModel extends mongoose.Model<TicketDocument> {
    build(attrs: TicketAttributes): TicketDocument;
  }
}
