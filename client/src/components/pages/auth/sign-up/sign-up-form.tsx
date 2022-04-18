import React from 'react';

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = (props) => {
  return (
    <form>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input name="email" id="email" type="text" className="form-control" />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
          className="form-control"
        />
      </div>
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUpForm;
