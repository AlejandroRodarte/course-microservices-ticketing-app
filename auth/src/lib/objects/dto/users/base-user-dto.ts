import { DbModelTypes } from '../../../types/db/models';
import { JwtTypes } from '../../../types/jwt';

class BaseUserDto {
  private id: string;
  private email: string;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }

  static fromUserDocument(userDocument: DbModelTypes.UserDocument) {
    return new BaseUserDto(userDocument._id, userDocument.email);
  }

  static fromJwtUserData(jwtUserData: JwtTypes.UserData) {
    return new BaseUserDto(jwtUserData.id, jwtUserData.email);
  }
}

export default BaseUserDto;
