import { objects } from '@msnr-ticketing-app/common';
import { DbHelpersTypes } from '../../../types/db/helpers';
import User from '../../models/user';

const findById: DbHelpersTypes.UserFindByIdFunction = async (id: string) => {
  try {
    const user = await User.findById(id);
    return [user, undefined];
  } catch (e) {
    return [
      undefined,
      new objects.errors.DatabaseOperationError(
        'find-by-id',
        'There was an error trying to find a user by its id.'
      ),
    ];
  }
};

export default findById;
