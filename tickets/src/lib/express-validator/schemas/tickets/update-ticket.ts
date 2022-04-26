import { Schema } from 'express-validator';

const updateTicket: Schema = {
  'data.ticketUpdates': {
    errorMessage: 'Update ticket data should be located at data.ticketUpdates',
    notEmpty: true,
  },
  'data.ticketUpdates.title': {
    errorMessage: 'A title should be supplied.',
    trim: true,
    notEmpty: true,
    optional: true,
  },
  'data.ticketUpdates.price': {
    errorMessage: 'A price should be supplied and be greater than 0.',
    isFloat: {
      options: {
        gt: 0,
      },
    },
    optional: true,
  },
};

export default updateTicket;
