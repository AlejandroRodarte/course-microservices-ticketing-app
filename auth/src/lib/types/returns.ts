export namespace ReturnTypes {
  export type AsyncTuple<DataType, ErrorType> = Promise<
    [DataType, undefined] | [undefined, ErrorType]
  >;
}
