import React, { useCallback, useState } from 'react';
import SignUpForm from '../../../components/pages/auth/sign-up/sign-up-form';
import requests from '../../../lib/requests';
import { FormTypes } from '../../../lib/types/forms';
import { PagesTypes } from '../../../lib/types/pages';

type SignUpPageRequestErrorKeys = 'auth/sign-up';
interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const [errors, setErrors] = useState<
    PagesTypes.RequestErrors<SignUpPageRequestErrorKeys>
  >({
    'auth/sign-up': undefined,
  });

  const onSubmit = useCallback(async (form: FormTypes.SignUpForm) => {
    const [response, error] = await requests.auth.signUp(form);
    if (!response || error) return;
    setErrors((prevErrors) => ({
      ...prevErrors,
      'auth/sign-up': response.error,
    }));
  }, []);
  return <SignUpForm onSubmit={onSubmit} error={errors['auth/sign-up']} />;
};

export default SignUpPage;
