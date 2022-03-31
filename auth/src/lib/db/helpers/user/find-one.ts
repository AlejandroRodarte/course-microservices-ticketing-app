import DatabaseOperationError from '../../../objects/errors/database-operation-error';
import { DbHelpersTypes } from '../../../types/db/helpers';
import User from '../../models/user';

const findOne: DbHelpersTypes.UserFindOneFunction = async (filters) => {
  try {
    const user = await User.findOne(filters);
    return [user, undefined];
  } catch (e) {
    return [
      undefined,
      new DatabaseOperationError(
        'find-one',
        'There was an error trying to find a user by its unique filter criteria.'
      ),
    ];
  }
};

export default findOne;
