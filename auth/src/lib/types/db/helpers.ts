import { FilterQuery, Document } from 'mongoose';
import DatabaseOperationError from '../../objects/errors/database-operation-error';
import { ReturnTypes } from '../returns';
import { DbModelTypes } from './models';

export namespace DbHelpersTypes {
  type UserExistsFunctionDataType = Pick<
    Document<DbModelTypes.UserDocument, any, any>,
    '_id'
  > | null;
  export type UserExistsFunction = (
    filter: FilterQuery<DbModelTypes.UserDocument>
  ) => ReturnTypes.AsyncTuple<
    UserExistsFunctionDataType,
    DatabaseOperationError
  >;

  export type UserSaveFunction = (
    document: DbModelTypes.UserDocument
  ) => ReturnTypes.AsyncTuple<
    DbModelTypes.UserDocument,
    DatabaseOperationError
  >;
}
