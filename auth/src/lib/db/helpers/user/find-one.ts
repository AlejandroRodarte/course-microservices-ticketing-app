import { objects } from '@msnr-ticketing-app/common';
import { DbHelpersTypes } from '../../../types/db/helpers';
import User from '../../models/user';

const findOne: DbHelpersTypes.UserFindOneFunction = async (filters) => {
  try {
    const user = await User.findOne(filters);
    return [user, undefined];
  } catch (e) {
    return [
      undefined,
      new objects.errors.DatabaseOperationError(
        'find-one',
        'There was an error trying to find a user by its unique filter criteria.'
      ),
    ];
  }
};

export default findOne;
