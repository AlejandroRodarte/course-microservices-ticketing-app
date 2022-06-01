import { useCallback, useEffect, useMemo, useState } from 'react';
import StripeCheckout, { Token } from 'react-stripe-checkout';
import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';
import { OrderResourceTypes } from '../../lib/types/resources/order';

interface OrderDetailsProps {
  order: OrdersObjectDtoTypes.BaseOrderDto;
  email: string;
  onToken: (token: string) => void;
  errors: JSX.Element | undefined;
  isOrderComplete: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = (props) => {
  const {
    order,
    email,
    errors,
    isOrderComplete,
    onToken: propsOnToken,
  } = props;

  const [timeLeft, setTimeLeft] = useState(0);
  const payableOrderStatuses: OrderResourceTypes.Status[] = useMemo(
    () => ['created', 'awaiting:payment'],
    []
  );
  const canOrderBePaid = useMemo(
    () =>
      payableOrderStatuses.includes(order.status) &&
      !isOrderComplete &&
      timeLeft > 0,
    [payableOrderStatuses, order.status, timeLeft, isOrderComplete]
  );

  const onToken = useCallback(
    (token: Token) => {
      propsOnToken(token.id);
    },
    [propsOnToken]
  );

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

  return (
    <div>
      {canOrderBePaid ? (
        <div>
          Time left to pay: {timeLeft} seconds.
          <StripeCheckout
            token={onToken}
            stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
            amount={order.ticket.price * 100}
            email={email}
          />
        </div>
      ) : (
        <h3>
          {isOrderComplete
            ? 'The order is complete. Payments are not accepted.'
            : payableOrderStatuses.includes(order.status)
            ? 'The order has expired. Payments are not accepted.'
            : `The order is ${order.status}. Payments are not accepted.`}
        </h3>
      )}
      {errors}
    </div>
  );
};

export default OrderDetails;
