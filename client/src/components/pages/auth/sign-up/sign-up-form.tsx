import React, { useCallback, useState } from 'react';
import { REQUEST_VALIDATION_ERROR } from '../../../../lib/constants/objects/errors';
import UniversalError from '../../../../lib/objects/universal-error';
import { FormTypes } from '../../../../lib/types/forms';

interface SignUpFormProps {
  onSubmit: (form: FormTypes.SignUpForm) => void;
  error: UniversalError | undefined;
}

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  const [form, setForm] = useState<FormTypes.SignUpForm>({
    email: '',
    password: '',
  });

  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const id = event.currentTarget.id as FormTypes.SignUpFormKeys;
      const value = event.currentTarget.value;
      setForm((prevForm) => ({
        ...prevForm,
        [id]: value,
      }));
    },
    []
  );

  const onSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      props.onSubmit(form);
    },
    [form]
  );

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          name="email"
          id="email"
          type="text"
          className="form-control"
          value={form.email}
          onChange={onInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
          className="form-control"
          value={form.password}
          onChange={onInputChange}
        />
      </div>
      {props.error && props.error.type === REQUEST_VALIDATION_ERROR && (
        <div className="alert alert-danger">
          <h4>Oops...</h4>
          <ul className="my-0">
            {props.error.errors.map((item) => (
              <li key={item.field}>{item.message}</li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
