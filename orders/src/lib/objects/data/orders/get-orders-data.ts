import { DataTypes } from '../../../types/objects/data';
import BaseOrderDto from '../../dto/orders/base-order-dto';

class GetOrdersData {
  private _orders: BaseOrderDto[];

  constructor(orders: BaseOrderDto[]) {
    this._orders = orders;
  }

  toJSON(): DataTypes.IGetOrdersData {
    return {
      orders: this.orders,
    };
  }

  get orders() {
    return this._orders;
  }

  set orders(orders: BaseOrderDto[]) {
    this._orders = orders;
  }
}

export default GetOrdersData;
