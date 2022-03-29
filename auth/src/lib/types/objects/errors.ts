export namespace ErrorObjectTypes {
  export interface UniversalErrorItem {
    message: string;
    field?: string;
  }
  export type DatabaseOperationErrorTypes = 'exists' | 'save';
  export type EntityErrorTypes = 'user';
}
