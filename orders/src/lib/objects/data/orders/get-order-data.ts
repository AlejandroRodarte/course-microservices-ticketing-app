import { DataTypes } from '../../../types/objects/data';
import BaseOrderDto from '../../dto/orders/base-order-dto';

class GetOrderData {
  private _order: BaseOrderDto;

  constructor(order: BaseOrderDto) {
    this._order = order;
  }

  toJSON(): DataTypes.IGetOrderData {
    return {
      order: this.order,
    };
  }

  get order() {
    return this._order;
  }

  set order(order: BaseOrderDto) {
    this._order = order;
  }
}

export default GetOrderData;
