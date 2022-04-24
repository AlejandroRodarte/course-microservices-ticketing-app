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
  }
  // utility function to build a Ticket document
  export type BuildTicketWrapperFunction = {
    (attrs: TicketAttributes): TicketDocument;
  };
  // extend Ticket model to include static methods
  export interface TicketModel extends mongoose.Model<TicketDocument> {
    build: BuildTicketWrapperFunction;
  }
}
