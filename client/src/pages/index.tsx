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

export default HomePage;
