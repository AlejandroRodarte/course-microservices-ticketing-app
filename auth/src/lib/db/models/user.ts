import mongoose from 'mongoose';
import { DbModelTypes } from '../../types/db/models';
import bcrypt from '../../bcrypt';

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

userSchema.statics.build = function (attributes: DbModelTypes.UserAttributes) {
  return new User(attributes);
};

userSchema.pre<DbModelTypes.UserDocument>('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const [hashedPassword, bcryptError] = await bcrypt.hash(user.password);
    if (typeof hashedPassword === 'undefined' && bcryptError) next(bcryptError);
    user.password = hashedPassword!;
    next();
  }
});

const User = mongoose.model<DbModelTypes.UserDocument, DbModelTypes.UserModel>(
  'User',
  userSchema
);

export default User;
