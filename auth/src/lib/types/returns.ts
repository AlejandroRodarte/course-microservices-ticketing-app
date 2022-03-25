export namespace ReturnTypes {
  export type AsyncTuple<DataType, ErrorType> = [
    DataType | undefined,
    ErrorType | undefined
  ];
}
