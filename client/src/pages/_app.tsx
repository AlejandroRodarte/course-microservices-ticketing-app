import 'bootstrap/dist/css/bootstrap.css';
import '../styles/globals.css';
import https from 'https';
import type { AppProps } from 'next/app';
import DefaultLayout from '../components/layouts/default-layout';
import { AppContextType } from 'next/dist/shared/lib/utils';
import doServerSideRequest from '../lib/requests/do-server-side-request';
import CurrentUserData from '../lib/objects/data/auth/current-user-data';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <Component {...pageProps} />
    </DefaultLayout>
  );
}

MyApp.getInitialProps = async ({ ctx }: AppContextType) => {
  console.log('getInitialProps called in _app.tsx');
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
        Cookie:
          ctx && ctx.req && ctx.req.headers.cookie
            ? ctx.req.headers.cookie
            : '',
      },
    },
  });
  console.log(response);
  // if (response && response.status === 200 && response.data)
  //   return { props: { user: response.data.user } };
  return { props: {} };
};

export default MyApp;
