import DatabaseOperationError from '../../../objects/errors/database-operation-error';
import { DbHelpersTypes } from '../../../types/db/helpers';
import User from '../../models/user';

const exists: DbHelpersTypes.UserExistsFunction = async (filter) => {
  try {
    const userExists = await User.exists(filter);
    return [userExists, undefined];
  } catch (e) {
    return [
      undefined,
      new DatabaseOperationError(
        'exists',
        'An error occured while trying to check that the user existed in the database.'
      ),
    ];
  }
};

export default exists;
