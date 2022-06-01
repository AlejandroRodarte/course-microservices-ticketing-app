import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import DefaultLayout from '../../../components/layouts/default-layout';
import OrderDetails from '../../../components/orders/order-details';
import useRequest from '../../../lib/hooks/use-request';
import requests from '../../../lib/requests';
import { PaymentsObjectDataTypes } from '../../../lib/types/objects/data/payments';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';
import { OrdersObjectDtoTypes } from '../../../lib/types/objects/dto/orders';
import { RequestTypes } from '../../../lib/types/requests';

interface OrderDetailsPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
  order: OrdersObjectDtoTypes.BaseOrderDto | null;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = (props) => {
  const { user, order } = props;
  const router = useRouter();

  const { doRequest, errors } = useRequest<
    RequestTypes.NewPaymentBody,
    PaymentsObjectDataTypes.NewPaymentData
  >({
    endpoint: 'payments',
    microservice: 'payments',
    method: 'post',
    config: {
      withCredentials: true,
    },
  });

  const [isOrderComplete, setIsOrderComplete] = useState(
    order !== null && order.status === 'complete'
  );

  const { id: orderId } = order!;

  const onPayment = useCallback(
    async (token: string) => {
      const [response, error] = await doRequest({
        data: { newCharge: { token, orderId } },
      });
      if (error || (response && response.error)) return;
      if (response && response.status === 201 && response.data) {
        setIsOrderComplete(() => true);
        router.replace('/orders');
      }
    },
    [doRequest, router, orderId]
  );

  return (
    <DefaultLayout user={user}>
      {order && (
        <OrderDetails
          order={order}
          email={user!.email}
          onToken={onPayment}
          errors={errors}
          isOrderComplete={isOrderComplete}
        />
      )}
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  OrderDetailsPageProps
> = async (ctx) => {
  const id = ctx.params
    ? ctx.params.id && typeof ctx.params.id === 'string'
      ? ctx.params.id
      : undefined
    : undefined;

  if (!id) return { redirect: { permanent: false, destination: '/' } };

  const user = await requests.auth.currentUser(ctx.req.headers.cookie);

  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: id
          ? `/auth/sign-in?redirect=${encodeURIComponent(`/orders/${id}`)}`
          : `/auth/sign-in?redirect=${encodeURIComponent('/orders')}`,
      },
    };

  const order = await requests.orders.getOrder(id, ctx.req.headers.cookie);

  if (!order)
    return {
      redirect: {
        permanent: false,
        destination: '/orders',
      },
    };

  return { props: { user, order } };
};

export default OrderDetailsPage;
