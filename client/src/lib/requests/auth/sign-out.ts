import ApplicationResponse from '../../objects/application-response';
import UniversalError from '../../objects/universal-error';
import { RequestTypes } from '../../types/requests';
import getUrl from '../../axios/get-url';
import api from '../../axios/api';

const signOut: RequestTypes.AuthSignOutFunction = async () => {
  try {
    const url = getUrl('auth/users/sign-out');
    const response = await api.post(
      url,
      {},
      {
        withCredentials: true,
      }
    );
    const data = response.data as ApplicationResponse<
      undefined,
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

export default signOut;
