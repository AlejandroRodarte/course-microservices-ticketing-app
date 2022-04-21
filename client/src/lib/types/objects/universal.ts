export namespace UniversalObjectTypes {
  interface UniversalErrorItem {
    message: string;
    field?: string;
  }
  export interface ApplicationResponse<DataType, ErrorType> {
    status: number;
    code: string;
    message: string;
    data?: DataType;
    error?: ErrorType;
  }
  export interface UniversalError {
    type: string;
    errors: UniversalErrorItem[];
  }
}
