import type { GetServerSideProps } from 'next';

interface HomePageProps {
  name: string;
}

const HomePage: React.FC<HomePageProps> = (props) => {
  return <div>HomePage: {props.name}</div>;
};

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  ctx
) => {
  console.log('pages/index.tsx/getServerSideProps');
  return { props: { name: 'Alejandro' } };
};

export default HomePage;
