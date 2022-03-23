import { Schema } from 'express-validator';

const signUp: Schema = {
  'data.credentials.email': {
    errorMessage: 'This input should be an email.',
    isEmail: true,
    trim: true,
  },
  'data.credentials.password': {
    errorMessage: 'Password should be between 4 and 20 characters.',
    trim: true,
    isLength: {
      options: {
        min: 4,
        max: 20,
      },
    },
  },
};

export default signUp;
