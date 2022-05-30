import { GetServerSideProps } from 'next';
import DefaultLayout from '../../components/layouts/default-layout';
import OrdersList from '../../components/orders/orders-list';
import requests from '../../lib/requests';
import { AuthObjectDtoTypes } from '../../lib/types/objects/dto/auth';
import { OrdersObjectDtoTypes } from '../../lib/types/objects/dto/orders';

interface UserOrdersPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
  orders: OrdersObjectDtoTypes.BaseOrderDto[] | null;
}

const UserOrdersPage: React.FC<UserOrdersPageProps> = (props) => {
  const { user, orders } = props;

  return (
    <DefaultLayout user={user}>
      {orders && <OrdersList orders={orders} />}
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  UserOrdersPageProps
> = async (ctx) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);

  if (!user)
    return {
      redirect: {
        permanent: false,
        destination: `/auth/sign-in/?redirect=${encodeURIComponent('/orders')}`,
      },
    };

  const orders = await requests.orders.getOrders(ctx.req.headers.cookie);

  if (!orders)
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };

  return { props: { user, orders } };
};

export default UserOrdersPage;
