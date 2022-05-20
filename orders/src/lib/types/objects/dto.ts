import { OrderResourceTypes } from '@msnr-ticketing-app/common';

export namespace DtoTypes {
  export interface IBaseTicketDto {
    id: string;
    title: string;
    price: number;
  }

  export interface IBaseOrderDto {
    id: string;
    userId: string;
    status: OrderResourceTypes.Status;
    expiresAt: string;
    ticket: IBaseTicketDto;
  }
}
