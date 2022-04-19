import { FormTypes } from '../../types/forms';
import api from '../../axios/api';
import ApplicationResponse from '../../objects/application-response';
import SignUpData from '../../objects/data/auth/sign-up-data';
import UniversalError from '../../objects/universal-error';
import { RequestTypes } from '../../types/requests';
import getUrl from '../../axios/get-url';

const signUp: RequestTypes.AuthSignUpFunction = async (
  form: FormTypes.SignUpForm
) => {
  const body = { data: { credentials: form } };
  try {
    const url = getUrl('auth/users/sign-up', 'auth');
    const response = await api.post(url, body, {
      withCredentials: true,
    });
    const data = response.data as ApplicationResponse<
      SignUpData,
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

export default signUp;
