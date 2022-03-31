import { Schema } from 'express-validator';

const signIn: Schema = {
  'data.credentials.email': {
    errorMessage: 'This input should be an email.',
    isEmail: true,
    trim: true,
  },
  'data.credentials.password': {
    errorMessage: 'A password should be supplied.',
    trim: true,
    notEmpty: true,
  },
};

export default signIn;
