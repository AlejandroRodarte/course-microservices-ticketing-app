import type { GetServerSideProps } from 'next';
import DefaultLayout from '../components/layouts/default-layout';
import requests from '../lib/requests';
import { AuthObjectDtoTypes } from '../lib/types/objects/dto/auth';

interface HomePageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
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
