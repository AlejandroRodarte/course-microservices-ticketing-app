import bcrypt from 'bcryptjs';
import LibraryError from '../objects/errors/library-error';
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
      new LibraryError(
        'bcrypt',
        'There was an error comparing the stored and provided passwords.'
      ),
    ];
  }
};

export default compare;
