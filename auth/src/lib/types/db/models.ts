export namespace DbModelTypes {
  export interface UserAttributes {
    email: string;
    password: string;
  }
  export type BuildUserWrapperFunction = (attrs: UserAttributes) => any
}
