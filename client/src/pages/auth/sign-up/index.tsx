import React, { useCallback } from 'react';
import SignUpForm from '../../../components/pages/auth/sign-up/sign-up-form';
import requests from '../../../lib/requests';
import { FormTypes } from '../../../lib/types/forms';

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const onSubmit = useCallback(async (form: FormTypes.SignUpForm) => {
    const [response, error] = await requests.auth.signUp(form);
    if (error) return;
    if (response && response.status === 201)
      console.log('The user got signed up.');
  }, []);
  return <SignUpForm onSubmit={onSubmit} />;
};

export default SignUpPage;
