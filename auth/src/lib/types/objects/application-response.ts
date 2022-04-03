export namespace ApplicationResponseTypes {
  export interface Body<DataType, ErrorType> {
    status: number;
    code: string;
    message: string;
    data: DataType;
    error: ErrorType;
  }
}
