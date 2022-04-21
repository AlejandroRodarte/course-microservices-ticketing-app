import bcrypt from 'bcryptjs';
import { objects } from '@msnr-ticketing-app/common';
import { BCryptTypes } from '../types/bcrypt';

const hash: BCryptTypes.HashFunction = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return [hashedPassword, undefined];
  } catch (e) {
    return [
      undefined,
      new objects.errors.LibraryError(
        'bcrypt',
        'There was an error hashing the password.'
      ),
    ];
  }
};

export default hash;
