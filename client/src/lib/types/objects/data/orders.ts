import { OrdersObjectDtoTypes } from '../dto/orders';

export namespace OrdersObjectDataTypes {
  export interface CreateOrderData {
    newOrder: OrdersObjectDtoTypes.BaseOrderDto;
  }
}
