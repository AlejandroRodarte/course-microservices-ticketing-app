import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import useRequest from '../../../lib/hooks/use-request';
import { RequestTypes } from '../../../lib/types/requests';
import { AuthObjectDtoTypes } from '../../../lib/types/objects/dto/auth';

interface SignOutPageProps {
  user: AuthObjectDtoTypes.BaseUserDto | null;
}

const SignOutPage: React.FC<SignOutPageProps> = (props) => {
  const router = useRouter();
  const { doRequest, errors } = useRequest<
    RequestTypes.SignOutRequestBody,
    undefined
  >({
    endpoint: 'auth/users/sign-out',
    microservice: 'auth',
    method: 'post',
    config: {
      withCredentials: true,
    },
  });

  const signOut = useCallback(async () => {
    const [response, error] = await doRequest({});
    if (response && [204, 401].includes(response.status)) router.replace('/');
  }, [doRequest, router]);

  useEffect(() => {
    signOut();
  }, [signOut]);

  return <div>Signing you out...</div>;
};

export default SignOutPage;
