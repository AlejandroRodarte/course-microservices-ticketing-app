import type { GetServerSideProps } from 'next';
import DefaultLayout from '../components/layouts/default-layout';
import BaseUserDto from '../lib/objects/dto/auth/base-user-dto';
import requests from '../lib/requests';

interface HomePageProps {
  user: BaseUserDto | null;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  return (
    <DefaultLayout user={props.user}>
      <h1> You are {props.user ? '' : 'NOT'} signed in.</h1>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  return { props: { user } };
};

export default HomePage;
