class ApplicationResponse<DataType, ErrorType> {
  public status: number;
  public code: string;
  public message: string;
  public data?: DataType;
  public error?: ErrorType;

  constructor(
    status: number,
    code: string,
    message: string,
    data?: DataType,
    error?: ErrorType
  ) {
    this.status = status;
    this.code = code;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}

export default ApplicationResponse;
