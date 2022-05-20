import { DataTypes } from '../../../types/objects/data';
import BaseOrderDto from '../../dto/orders/base-order-dto';

class UpdateOrderData {
  private _updatedOrder: BaseOrderDto;

  constructor(updatedOrder: BaseOrderDto) {
    this._updatedOrder = updatedOrder;
  }

  toJSON(): DataTypes.IUpdateOrderData {
    return {
      updatedOrder: this.updatedOrder,
    };
  }

  get updatedOrder() {
    return this._updatedOrder;
  }

  set updatedOrder(updatedOrder: BaseOrderDto) {
    this._updatedOrder = updatedOrder;
  }
}

export default UpdateOrderData;
