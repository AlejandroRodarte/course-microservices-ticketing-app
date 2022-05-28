import { GetServerSideProps } from 'next';
import DefaultLayout from '../../components/layouts/default-layout';
import requests from '../../lib/requests';
import { AuthObjectDtoTypes } from '../../lib/types/objects/dto/auth';

interface UserOrdersPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const UserOrdersPage: React.FC<UserOrdersPageProps> = (props) => {
  const { user } = props;

  return (
    <DefaultLayout user={user}>
      <div>UserOrdersPage</div>
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
  return { props: { user } };
};

export default UserOrdersPage;
