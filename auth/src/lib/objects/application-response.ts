class ApplicationResponse<DataType, ErrorType> {
  private status: number;
  private code: string;
  private message: string;
  private data?: DataType;
  private error?: ErrorType;

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

  static getGenericErrorResponse(): ApplicationResponse<undefined, undefined> {
    return new ApplicationResponse<undefined, undefined>(
      400,
      'GENERIC_ERROR',
      'Something went wrong with the application.',
      undefined,
      undefined
    );
  }
}

export default ApplicationResponse;
