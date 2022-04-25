import BaseUserDto from '../../dto/users/base-user-dto';

interface ICurrentUserData {
  user: BaseUserDto;
}

class CurrentUserData {
  private _user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this._user = user;
  }

  toJSON(): ICurrentUserData {
    return {
      user: this.user,
    };
  }

  get user() {
    return this._user;
  }

  set user(user: BaseUserDto) {
    this._user = user;
  }
}

export default CurrentUserData;
