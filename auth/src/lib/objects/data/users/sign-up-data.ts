import BaseUserDto from '../../dto/users/base-user-dto';

class SignUpData {
  private user: BaseUserDto;

  constructor(user: BaseUserDto) {
    this.user = user;
  }
}

export default SignUpData;
