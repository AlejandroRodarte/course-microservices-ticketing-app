import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { FormTypes } from '../../../lib/types/forms';
import useRequest from '../../../lib/hooks/use-request';
import { RequestTypes } from '../../../lib/types/requests';
import CredentialsForm from '../../../components/pages/auth/credentials-form';
import { GetServerSideProps } from 'next';
import requests from '../../../lib/requests';
import DefaultLayout from '../../../components/layouts/default-layout';
import { AuthObjectDataTypes } from '../../../lib/types/objects/data/auth';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';

interface SignUpPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const router = useRouter();
  const { redirect } = router.query;

  const { doRequest, errors } = useRequest<
    RequestTypes.SignUpRequestBody,
    AuthObjectDataTypes.SignUpData
  >({
    endpoint: 'auth/users/sign-up',
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
      if (response && response.status === 201) {
        if (redirect && typeof redirect === 'string')
          router.replace(decodeURIComponent(redirect));
        else router.replace('/');
      }
    },
    [router, doRequest]
  );
  return (
    <DefaultLayout user={props.user}>
      <CredentialsForm type="Sign Up" onSubmit={onSubmit} errors={errors} />
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<SignUpPageProps> = async (
  ctx
) => {
  const user = await requests.auth.currentUser(ctx.req.headers.cookie);
  return { props: { user } };
};

export default SignUpPage;
