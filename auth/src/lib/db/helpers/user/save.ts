import DatabaseOperationError from '../../../objects/errors/database-operation-error';
import { DbHelpersTypes } from '../../../types/db/helpers';

const save: DbHelpersTypes.UserSaveFunction = async (user) => {
  try {
    const savedUser = await user.save();
    return [savedUser, undefined];
  } catch (e) {
    return [
      undefined,
      new DatabaseOperationError(
        'save',
        'There was a problem saving the user into the database.'
      ),
    ];
  }
};

export default save;
