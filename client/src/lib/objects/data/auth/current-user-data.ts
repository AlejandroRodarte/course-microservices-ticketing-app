import BaseUserDto from '../../dto/auth/base-user-dto';

class CurrentUserData {
  public user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this.user = user;
  }
}

export default CurrentUserData;
