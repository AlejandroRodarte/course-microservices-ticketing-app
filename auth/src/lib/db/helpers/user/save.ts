import { objects } from '@msnr-ticketing-app/common';
import { DbHelpersTypes } from '../../../types/db/helpers';

const save: DbHelpersTypes.UserSaveFunction = async (user) => {
  try {
    const savedUser = await user.save();
    return [savedUser, undefined];
  } catch (e) {
    return [
      undefined,
      new objects.errors.DatabaseOperationError(
        'save',
        'There was a problem saving the user into the database.'
      ),
    ];
  }
};

export default save;
