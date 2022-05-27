import { OrderResourceTypes } from '../../resources/order';
import { TicketsObjectDtoTypes } from './tickets';

export namespace OrdersObjectDtoTypes {
  export interface BaseOrderDto {
    id: string;
    userId: string;
    status: OrderResourceTypes.Status;
    expiresAt: string;
    version: number;
    ticket: TicketsObjectDtoTypes.BaseTicketDto;
  }
}
