import https from 'https';
import doServerSideRequest from '../do-server-side-request';
import { RequestTypes } from '../../types/requests';
import { AuthObjectDataTypes } from '../../types/objects/data/auth';

const currentUser: RequestTypes.AuthCurrentUserFunction = async (
  cookie?: string
) => {
  const [response, error] = await doServerSideRequest<
    undefined,
    AuthObjectDataTypes.CurrentUserData
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
        Cookie: cookie || '',
      },
    },
  });
  if (response && response.status === 200 && response.data)
    return response.data.user;
  return null;
};

export default currentUser;
