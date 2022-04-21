import bcrypt from 'bcryptjs';
import { objects } from '@msnr-ticketing-app/common';
import { BCryptTypes } from '../types/bcrypt';

const compare: BCryptTypes.CompareFunction = async (
  storedPassword,
  providedPassword
) => {
  try {
    const arePasswordsEqual = await bcrypt.compare(
      providedPassword,
      storedPassword
    );
    return [arePasswordsEqual, undefined];
  } catch (e) {
    return [
      undefined,
      new objects.errors.LibraryError(
        'bcrypt',
        'There was an error comparing the stored and provided passwords.'
      ),
    ];
  }
};

export default compare;
