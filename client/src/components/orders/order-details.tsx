import { useEffect, useState } from 'react';
import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';

interface OrderDetailsProps {
  order: OrdersObjectDtoTypes.BaseOrderDto;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
  const { order } = props;

  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const findTimeLeft = () => {
      setTimeLeft(() =>
        Math.round(
          (new Date(order.expiresAt).getTime() - new Date().getTime()) / 1000
        ).toString()
      );
    };

    findTimeLeft();

    const intervalId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [setTimeLeft, order.expiresAt]);

  return <div>Time left to pay: {timeLeft} seconds.</div>;
};

export default OrderDetails;
