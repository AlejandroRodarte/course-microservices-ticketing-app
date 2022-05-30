import { OrdersObjectDtoTypes } from '../dto/orders';

export namespace OrdersObjectDataTypes {
  export interface CreateOrderData {
    newOrder: OrdersObjectDtoTypes.BaseOrderDto;
  }

  export interface GetOrderData {
    order: OrdersObjectDtoTypes.BaseOrderDto;
  }

  export interface GetOrdersData {
    orders: OrdersObjectDtoTypes.BaseOrderDto[];
  }
}
