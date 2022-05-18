import { Schema } from 'express-validator';
import mongoose from 'mongoose';

const newOrder: Schema = {
  'data.newOrder.ticketId': {
    errorMessage: 'A ticket ID should be supplied and match a MongoDB ObjectID structure.',
    trim: true,
    notEmpty: true,
    custom: {
      options: (input: string) => mongoose.Types.ObjectId.isValid(input),
    },
  },
};

export default newOrder;
