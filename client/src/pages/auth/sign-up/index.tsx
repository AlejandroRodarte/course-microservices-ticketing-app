import React, { useCallback } from 'react';
import SignUpForm from '../../../components/pages/auth/sign-up/sign-up-form';
import { FormTypes } from '../../../lib/types/forms';
import useRequest from '../../../lib/hooks/use-request';
import SignUpData from '../../../lib/objects/data/auth/sign-up-data';
import { RequestTypes } from '../../../lib/types/requests';

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const { doRequest, errors } = useRequest<
    RequestTypes.SignUpRequestBody,
    SignUpData
  >({
    endpoint: 'auth/users/sign-up',
    microservice: 'auth',
    method: 'post',
    config: {
      withCredentials: true,
    },
  });

  const onSubmit = useCallback(async (form: FormTypes.SignUpForm) => {
    const [response, error] = await doRequest({ data: { credentials: form } });
    if (response && response.status === 201) console.log('User got signed in.');
  }, []);
  return <SignUpForm onSubmit={onSubmit} errors={errors} />;
};

export default SignUpPage;
