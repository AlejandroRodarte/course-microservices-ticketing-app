import { AuthObjectDtoTypes } from '../dto/auth';

export namespace AuthObjectDataTypes {
  export interface CurrentUserData {
    user: AuthObjectDtoTypes.BaseUserDto;
  }
  export interface SignInData extends CurrentUserData {}
  export interface SignUpData extends CurrentUserData {}
}
