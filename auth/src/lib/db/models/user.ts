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

userSchema.statics.build = (attributes: DbModelTypes.UserAttributes) =>
  new User(attributes);

const User = mongoose.model<any, DbModelTypes.UserStaticMethods>(
  'User',
  userSchema
);

export default User;
