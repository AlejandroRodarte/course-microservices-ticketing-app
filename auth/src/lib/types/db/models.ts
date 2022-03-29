import mongoose from 'mongoose';

export namespace DbModelTypes {
  /**
   * User model interfaces
   */
  // ---
  // interface to describe properties required to create a User
  export interface UserAttributes {
    email: string;
    password: string;
  }
  // interface to describe properties that a user document has
  export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
  }
  export type BuildUserWrapperFunction = {
    (attrs: UserAttributes): UserDocument;
  };
  // interface to describe additional static methods for the User model
  export interface UserModel extends mongoose.Model<UserDocument> {
    build: BuildUserWrapperFunction;
  }
}
