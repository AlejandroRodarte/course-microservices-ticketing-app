import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { FormTypes } from '../../../lib/types/forms';
import useRequest from '../../../lib/hooks/use-request';
import SignUpData from '../../../lib/objects/data/auth/sign-up-data';
import { RequestTypes } from '../../../lib/types/requests';
import CredentialsForm from '../../../components/pages/auth/credentials-form';
import BaseUserDto from '../../../lib/objects/dto/auth/base-user-dto';
import { GetServerSideProps } from 'next';
import requests from '../../../lib/requests';
import DefaultLayout from '../../../components/layouts/default-layout';

interface SignUpPageProps {
  user: BaseUserDto | null;
}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const router = useRouter();
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

  const onSubmit = useCallback(
    async (form: FormTypes.CredentialsForm) => {
      const [response, error] = await doRequest({
        data: { credentials: form },
      });
      if (response && response.status === 201) router.replace('/');
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
