import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';
import OrderItem from './order.item';

interface OrdersListProps {
  orders: OrdersObjectDtoTypes.BaseOrderDto[];
}

const OrdersList: React.FC<OrdersListProps> = (props) => {
  const { orders } = props;

  return (
    <ul>
      {orders.map((order) => (
        <OrderItem key={order.id} order={order} />
      ))}
    </ul>
  );
};

export default OrdersList;
