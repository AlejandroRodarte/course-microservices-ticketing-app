import React, { useCallback, useState } from 'react';
import { FormTypes } from '../../../lib/types/forms';

interface CredentialsForm {
  type: 'Sign Up' | 'Sign In';
  onSubmit: (form: FormTypes.CredentialsForm) => void;
  errors: JSX.Element | undefined;
}

const CredentialsForm: React.FC<CredentialsForm> = (props) => {
  const [form, setForm] = useState<FormTypes.CredentialsForm>({
    email: '',
    password: '',
  });

  const onInputChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      const id = event.currentTarget.id as FormTypes.CredentialsFormKeys;
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
      <h1>{props.type}</h1>
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
      {props.errors}
      <button className="btn btn-primary">{props.type}</button>
    </form>
  );
};

export default CredentialsForm;
