import BaseOrderDto from '../../objects/dto/orders/base-order-dto';

export namespace DataTypes {
  export interface ICreateOrderData {
    newOrder: BaseOrderDto;
  }
  export interface IGetOrdersData {
    orders: BaseOrderDto[];
  }
  export interface IGetOrderData {
    order: BaseOrderDto;
  }
  export interface IUpdateOrderData {
    updatedOrder: BaseOrderDto;
  }
}
