import BaseUserDto from '../../dto/users/base-user-dto';

interface ISignUpData {
  user: BaseUserDto;
}

class SignUpData {
  private _user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this._user = user;
  }

  toJSON(): ISignUpData {
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

export default SignUpData;
