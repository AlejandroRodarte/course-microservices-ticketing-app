import { JwtTypes } from '@msnr-ticketing-app/common';
import { DbModelTypes } from '../../../types/db/models';

interface IBaseUserDto {
  id: string;
  email: string;
}

class BaseUserDto {
  private _id: string;
  private _email: string;

  constructor(id: string, email: string) {
    this._id = id;
    this._email = email;
  }

  toJSON(): IBaseUserDto {
    return {
      id: this.id,
      email: this.email,
    };
  }

  static fromUserDocument(userDocument: DbModelTypes.UserDocument) {
    return new BaseUserDto(userDocument._id, userDocument.email);
  }

  static fromJwtUserData(jwtUserData: JwtTypes.UserData) {
    return new BaseUserDto(jwtUserData.id, jwtUserData.email);
  }

  get id() {
    return this._id;
  }

  get email() {
    return this._email;
  }

  set id(id: string) {
    this._id = id;
  }

  set email(email: string) {
    this.email = email;
  }
}

export default BaseUserDto;
