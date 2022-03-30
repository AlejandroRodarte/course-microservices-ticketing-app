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
  // User model
  export type UserExistsFunction = ExistsFunction<DbModelTypes.UserDocument>;
  export type UserSaveFunction = SaveFunction<DbModelTypes.UserDocument>;
}
