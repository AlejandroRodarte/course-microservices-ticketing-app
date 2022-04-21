import { FilterQuery, Document } from 'mongoose';
import { objects, ReturnTypes } from '@msnr-ticketing-app/common';
import { DbModelTypes } from './models';

export namespace DbHelpersTypes {
  // Model.exists()
  type ExistsDataType<DocumentType> = Pick<
    Document<DocumentType, any, any>,
    '_id'
  > | null;
  type ExistsFunction<DocumentType> = (
    filter: FilterQuery<DocumentType>
  ) => ReturnTypes.AsyncTuple<
    ExistsDataType<Document>,
    InstanceType<typeof objects.errors.DatabaseOperationError>
  >;
  // Model.save()
  type SaveFunction<DocumentType> = (
    document: DocumentType
  ) => ReturnTypes.AsyncTuple<
    DocumentType,
    InstanceType<typeof objects.errors.DatabaseOperationError>
  >;
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
    InstanceType<typeof objects.errors.DatabaseOperationError>
  >;
  // Model.findOne()
  type FindOneDataType<DocumentType> = FindByIdDataType<DocumentType>;
  type FindOneFunction<DocumentType> = (
    filter: FilterQuery<DocumentType>
  ) => ReturnTypes.AsyncTuple<
    FindOneDataType<DocumentType>,
    InstanceType<typeof objects.errors.DatabaseOperationError>
  >;
  // User model
  export type UserExistsFunction = ExistsFunction<DbModelTypes.UserDocument>;
  export type UserSaveFunction = SaveFunction<DbModelTypes.UserDocument>;
  export type UserFindByIdFunction =
    FindByIdFunction<DbModelTypes.UserDocument>;
  export type UserFindOneFunction = FindOneFunction<DbModelTypes.UserDocument>;
}
