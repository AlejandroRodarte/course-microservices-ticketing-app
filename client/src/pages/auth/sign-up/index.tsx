import React, { useCallback } from 'react';
import SignUpForm from '../../../components/pages/auth/sign-up/sign-up-form';
import { FormTypes } from '../../../types/forms';

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = (props) => {
  const onSubmit = useCallback((form: FormTypes.SignUpForm) => {
    console.log(form);
  }, []);
  return <SignUpForm onSubmit={onSubmit} />;
};

export default SignUpPage;
