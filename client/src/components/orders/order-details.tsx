import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';

interface OrderDetailsProps {
  order: OrdersObjectDtoTypes.BaseOrderDto;
  email: string;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
  const { order, email } = props;

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
  return (
    <div>
      Time left to pay: {timeLeft} seconds.
      <StripeCheckout
        token={(token) => console.log(token)}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        amount={order.ticket.price * 100}
        email={email}
      />
    </div>
  );
};

export default OrderDetails;
