export namespace TicketsObjectDtoTypes {
  export interface BaseTicketDto {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  }
}
