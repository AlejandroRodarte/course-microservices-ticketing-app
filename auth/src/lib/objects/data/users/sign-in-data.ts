import BaseUserDto from '../../dto/users/base-user-dto';

class SignInData {
  private user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this.user = user;
  }
}

export default SignInData;
