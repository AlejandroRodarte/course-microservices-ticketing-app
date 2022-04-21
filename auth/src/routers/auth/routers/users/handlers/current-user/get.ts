import { Response } from 'express';
import { objects } from '@msnr-ticketing-app/common';
import CurrentUserData from '../../../../../../lib/objects/data/users/current-user-data';
import BaseUserDto from '../../../../../../lib/objects/dto/users/base-user-dto';
import { UsersRequestHandlers } from '../../../../../../lib/types/request-handlers/users';

const get = (
  req: UsersRequestHandlers.GetCurrentUserExtendedRequest,
  res: Response
) => {
  return res
    .status(200)
    .send(
      new objects.ApplicationResponse<CurrentUserData, undefined>(
        200,
        'CURRENT_USER_FETCHED',
        'The user information has been fetched succesfully.',
        new CurrentUserData(BaseUserDto.fromJwtUserData(req['jwt/user-data']!)),
        undefined
      )
    );
};

export default get;
