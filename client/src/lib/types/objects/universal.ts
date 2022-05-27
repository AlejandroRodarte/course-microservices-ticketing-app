import codes from '../../constants/responses/codes';

export namespace UniversalObjectTypes {
  interface UniversalErrorItem {
    message: string;
    field?: string;
  }
  export interface ApplicationResponse<DataType, ErrorType> {
    status: number;
    code: typeof codes[number];
    message: string;
    data?: DataType;
    error?: ErrorType;
  }
  export interface UniversalError {
    type: string;
    errors: UniversalErrorItem[];
  }
}
