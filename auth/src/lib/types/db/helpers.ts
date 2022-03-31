import { FilterQuery, Document } from 'mongoose';
import DatabaseOperationError from '../../objects/errors/database-operation-error';
import { ReturnTypes } from '../returns';
import { DbModelTypes } from './models';

export namespace DbHelpersTypes {
  // Model.exists()
  type ExistsDataType<DocumentType> = Pick<
    Document<DocumentType, any, any>,
    '_id'
  > | null;
  type ExistsFunction<DocumentType> = (
    filter: FilterQuery<DocumentType>
  ) => ReturnTypes.AsyncTuple<ExistsDataType<Document>, DatabaseOperationError>;
  // Model.save()
  type SaveFunction<DocumentType> = (
    document: DocumentType
  ) => ReturnTypes.AsyncTuple<DocumentType, DatabaseOperationError>;
  // Model.findOneById()
  type FindByIdDataType<DocumentType> =
    | (DocumentType & {
        _id: any;
      })
    | null;
  type FindByIdFunction<DocumentType> = (
    id: string
  ) => ReturnTypes.AsyncTuple<
    FindByIdDataType<DocumentType>,
    DatabaseOperationError
  >;
  // Model.findOne()
  type FindOneDataType<DocumentType> = FindByIdDataType<DocumentType>;
  type FindOneFunction<DocumentType> = (
    filter: FilterQuery<DocumentType>
  ) => ReturnTypes.AsyncTuple<
    FindOneDataType<DocumentType>,
    DatabaseOperationError
  >;
  // User model
  export type UserExistsFunction = ExistsFunction<DbModelTypes.UserDocument>;
  export type UserSaveFunction = SaveFunction<DbModelTypes.UserDocument>;
  export type UserFindByIdFunction =
    FindByIdFunction<DbModelTypes.UserDocument>;
  export type UserFindOneFunction = FindOneFunction<DbModelTypes.UserDocument>;
}
