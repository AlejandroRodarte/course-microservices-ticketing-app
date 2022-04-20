import https from 'https';
import type { GetServerSideProps } from 'next';
import CurrentUserData from '../lib/objects/data/auth/current-user-data';
import BaseUserDto from '../lib/objects/dto/auth/base-user-dto';
import doServerSideRequest from '../lib/requests/do-server-side-request';

interface HomePageProps {
  user: BaseUserDto | null;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  return <h1> You are {props.user ? '' : 'NOT'} signed in.</h1>;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  const [response, error] = await doServerSideRequest<
    undefined,
    CurrentUserData
  >({
    endpoint: 'auth/users/current-user',
    microservice: 'auth',
    method: 'get',
    config: {
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        Cookie: ctx.req.headers.cookie || '',
      },
    },
  });
  if (response && response.status === 200 && response.data)
    return { props: { user: response.data.user } };
  return { props: { user: null } };
};

export default HomePage;
