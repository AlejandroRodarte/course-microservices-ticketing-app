import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import DefaultLayout from '../components/layouts/default-layout';
import { NextPageContext } from 'next';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  );
}

MyApp.getInitialProps = async (ctx: NextPageContext) => {
  console.log('getInitialProps called in _app.tsx');
  return { props: {} };
};

export default MyApp;
