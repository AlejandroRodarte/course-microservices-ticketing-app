import BaseUserDto from '../../dto/users/base-user-dto';

class CurrentUserData {
  private user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this.user = user;
  }
}

export default CurrentUserData;
