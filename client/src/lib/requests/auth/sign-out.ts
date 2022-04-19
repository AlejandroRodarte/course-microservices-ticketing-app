import api from '../../axios/api';
import ApplicationResponse from '../../objects/application-response';
import UniversalError from '../../objects/universal-error';
import { RequestTypes } from '../../types/requests';
import { IS_DOCKER } from '../../constants/env';

const signOut: RequestTypes.AuthSignOutFunction = async () => {
  try {
    const url = IS_DOCKER
      ? `:${process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_PORT}/auth/users/sign-out`
      : '/auth/users/sign-out';
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
