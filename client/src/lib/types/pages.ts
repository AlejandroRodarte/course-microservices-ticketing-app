import { UniversalObjectTypes } from './objects/universal';

export namespace PagesTypes {
  export type RequestErrors<Keys extends string | number | symbol> = Record<
    Keys,
    UniversalObjectTypes.UniversalError | undefined
  >;
}
