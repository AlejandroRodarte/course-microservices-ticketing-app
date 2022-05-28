import { useEffect, useState } from 'react';
import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';

interface OrderDetailsProps {
  order: OrdersObjectDtoTypes.BaseOrderDto;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
  const { order } = props;

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      setTimeLeft(() =>
        Math.round(
          (new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000
        )
      );
    };

    findTimeLeft();

    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setTimeLeft, order.expiresAt]);

  if (timeLeft < 0) return <div>Order Expired</div>;
  return <div>Time left to pay: {timeLeft} seconds.</div>;
};

export default OrderDetails;
