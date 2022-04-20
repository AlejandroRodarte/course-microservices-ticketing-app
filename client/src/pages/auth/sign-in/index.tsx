import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { FormTypes } from '../../../lib/types/forms';
import useRequest from '../../../lib/hooks/use-request';
import SignUpData from '../../../lib/objects/data/auth/sign-up-data';
import { RequestTypes } from '../../../lib/types/requests';
import CredentialsForm from '../../../components/pages/auth/credentials-form';

interface SignInPageProps {}

const SignInPage: React.FC<SignInPageProps> = (props) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest<
    RequestTypes.SignUpRequestBody,
    SignUpData
  >({
    endpoint: 'auth/users/sign-in',
    microservice: 'auth',
    method: 'post',
    config: {
      withCredentials: true,
    },
  });

  const onSubmit = useCallback(
    async (form: FormTypes.CredentialsForm) => {
      const [response, error] = await doRequest({
        data: { credentials: form },
      });
      if (response && response.status === 200) router.replace('/');
    },
    [router, doRequest]
  );
  return <CredentialsForm type="Sign In" onSubmit={onSubmit} errors={errors} />;
};

export default SignInPage;
