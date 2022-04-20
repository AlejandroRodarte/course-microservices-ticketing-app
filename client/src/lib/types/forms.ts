export namespace FormTypes {
  export interface CredentialsForm {
    email: string;
    password: string;
  }
  export type CredentialsFormKeys = keyof CredentialsForm;
}
