import UniversalError from '../objects/universal-error';

export namespace PagesTypes {
  export type RequestErrors<Keys extends string | number | symbol> = Record<
    Keys,
    UniversalError | undefined
  >;
}
