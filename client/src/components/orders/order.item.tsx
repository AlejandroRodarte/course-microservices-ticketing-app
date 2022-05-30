import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';

interface OrderItemProps {
  order: OrdersObjectDtoTypes.BaseOrderDto;
}

const OrderItem: React.FC<OrderItemProps> = (props) => {
  const { order } = props;

  return (
    <li>
      {order.ticket.title} - {order.status}
    </li>
  );
};

export default OrderItem;
