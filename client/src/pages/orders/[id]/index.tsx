import { GetServerSideProps } from 'next';
import DefaultLayout from '../../../components/layouts/default-layout';
import OrderDetails from '../../../components/orders/order-details';
import requests from '../../../lib/requests';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';
import { OrdersObjectDtoTypes } from '../../../lib/types/objects/dto/orders';

interface OrderDetailsPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
  order: OrdersObjectDtoTypes.BaseOrderDto | null;
}

const OrderDetailsPage: React.FC<OrderDetailsPageProps> = (props) => {
  const { user, order } = props;

  return (
    <DefaultLayout user={user}>
      {order && <OrderDetails order={order} />}
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
  const order = await requests.orders.getOrder(id, ctx.req.headers.cookie);

  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: id
          ? `/auth/sign-in?redirect=${encodeURIComponent(`/orders/${id}`)}}`
          : `/auth/sign-in?redirect=${encodeURIComponent('/orders')}}`,
      },
    };

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
