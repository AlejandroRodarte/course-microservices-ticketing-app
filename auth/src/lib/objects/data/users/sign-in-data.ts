import BaseUserDto from '../../dto/users/base-user-dto';

interface ISignInData {
  user: BaseUserDto;
}

class SignInData {
  private _user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this._user = user;
  }

  toJSON(): ISignInData {
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

export default SignInData;
