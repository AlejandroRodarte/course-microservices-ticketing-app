export namespace ResponsesConstants {
  interface ApplicationResponseData {
    status: number;
    code: string;
    message: string;
  }
  export type ApplicationResponseDataDictionary = {
    [x: string]: ApplicationResponseData;
  };
}
