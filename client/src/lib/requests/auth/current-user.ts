import https from 'https';
import api from '../../axios/api';
import ApplicationResponse from '../../objects/application-response';
import UniversalError from '../../objects/universal-error';
import { RequestTypes } from '../../types/requests';
import getUrl from '../../axios/get-url';
import CurrentUserData from '../../objects/data/auth/current-user-data';

const currentUser: RequestTypes.AuthCurrentUserFunction = async (cookie) => {
  try {
    const url = getUrl('auth/users/current-user', 'auth', true);
    const response = await api.get(url, {
      withCredentials: true,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        Cookie: cookie || '',
      },
    });
    const data = response.data as ApplicationResponse<
      CurrentUserData,
      UniversalError
    >;
    return [data, undefined];
  } catch (e) {
    return [
      undefined,
      new UniversalError('RequestError', [
        { message: 'A network error occured during the request.' },
      ]),
    ];
  }
};

export default currentUser;
