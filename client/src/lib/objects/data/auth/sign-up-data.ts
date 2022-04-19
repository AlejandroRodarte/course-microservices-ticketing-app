import BaseUserDto from '../../dto/auth/base-user-dto';

class SignUpData {
  public user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this.user = user;
  }
}

export default SignUpData;
