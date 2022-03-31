export namespace ErrorObjectTypes {
  export interface UniversalErrorItem {
    message: string;
    field?: string;
  }
  export type DatabaseOperationErrorTypes = 'exists' | 'save' | 'find-by-id' | 'find-one';
  export type EntityErrorTypes = 'user';
  export type LibraryErrorTypes = 'bcrypt';
}
