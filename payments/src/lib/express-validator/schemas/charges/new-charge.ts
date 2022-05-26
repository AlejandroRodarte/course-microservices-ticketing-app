import { Schema } from 'express-validator';
import mongoose from 'mongoose';

const newCharge: Schema = {
  'data.newCharge.token': {
    errorMessage: 'A Strapi API token should be supplied.',
    trim: true,
    notEmpty: true,
  },
  'data.newCharge.orderId': {
    trim: true,
    notEmpty: {
      errorMessage: 'An order ID should be supplied.',
    },
    custom: {
      options: (input: string) => mongoose.Types.ObjectId.isValid(input),
      errorMessage:
        'An order ID should be supplied and match a MongoDB ObjectID structure.',
    },
  },
};

export default newCharge;
