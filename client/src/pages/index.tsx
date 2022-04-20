import type { GetServerSideProps } from 'next';
import BaseUserDto from '../lib/objects/dto/auth/base-user-dto';
import requests from '../lib/requests';

interface HomePageProps {
  user: BaseUserDto | null;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <div>HomePage: {props.user ? props.user.email : 'Not logged in.'}</div>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  const [response, error] = await requests.auth.currentUser({
    isServer: true,
    cookie: ctx.req.headers.cookie,
  });
  if (response && response.status === 200 && response.data)
    return { props: { user: response.data.user } };
  return { props: { user: null } };
};

export default HomePage;
