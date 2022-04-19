import BaseUserDto from '../../dto/auth/base-user-dto';

class SignInData {
  public user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this.user = user;
  }
}

export default SignInData;
