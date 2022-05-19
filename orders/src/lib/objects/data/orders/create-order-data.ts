import { DataTypes } from '../../../types/objects/data';
import BaseOrderDto from '../../dto/orders/base-order-dto';

class CreateOrderData {
  private _newOrder: BaseOrderDto;

  constructor(newOrder: BaseOrderDto) {
    this._newOrder = newOrder;
  }

  toJSON(): DataTypes.ICreateOrderData {
    return {
      newOrder: this.newOrder,
    };
  }

  get newOrder() {
    return this._newOrder;
  }

  set newOrder(newOrder: BaseOrderDto) {
    this._newOrder = newOrder;
  }
}

export default CreateOrderData;
