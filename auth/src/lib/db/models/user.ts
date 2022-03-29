import mongoose from 'mongoose';

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

export default User;
