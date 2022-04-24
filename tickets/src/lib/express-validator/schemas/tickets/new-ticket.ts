import { Schema } from 'express-validator';

const newTicket: Schema = {
  'data.newTicket.title': {
    errorMessage: 'A title should be supplied.',
    trim: true,
    notEmpty: true,
  },
  'data.newTicket.price': {
    errorMessage: 'A price should be supplied and be greater than 0.',
    isFloat: {
      options: {
        gt: 0,
      },
    },
  },
};

export default newTicket;
