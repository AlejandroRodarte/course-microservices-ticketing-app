import LibraryError from '../objects/errors/library-error';
import { ReturnTypes } from './returns';

export namespace BCryptTypes {
  export type HashFunction = (
    password: string
  ) => ReturnTypes.AsyncTuple<string, LibraryError>;
  export type CompareFunction = (
    storedPassword: string,
    providedPassword: string
  ) => ReturnTypes.AsyncTuple<boolean, LibraryError>;
}
