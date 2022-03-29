import mongoose from 'mongoose';
import { DbModelTypes } from '../../types/db/models';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'An email is required when creating a user.'],
  },
  password: {
    type: String,
    required: [true, 'A password is required when creating a user.'],
  },
});

const User = mongoose.model('User', userSchema);

const buildUser: DbModelTypes.BuildUserWrapperFunction = (attributes) =>
  new User(attributes);

export { User, buildUser };
