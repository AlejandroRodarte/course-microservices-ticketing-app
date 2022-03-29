import mongoose from 'mongoose';

export namespace DbModelTypes {
  export interface UserAttributes {
    email: string;
    password: string;
  }
  export type BuildUserWrapperFunction = (attrs: UserAttributes) => any;
  export interface UserStaticMethods extends mongoose.Model<any> {
    build: BuildUserWrapperFunction;
  }
}
