import BaseOrderDto from '../../objects/dto/orders/base-order-dto';

export namespace DataTypes {
  export interface ICreateOrderData {
    newOrder: BaseOrderDto;
  }
}
