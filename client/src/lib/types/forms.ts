export namespace FormTypes {
  export interface SignUpForm {
    email: string;
    password: string;
  }
  export type SignUpFormKeys = keyof SignUpForm;
}
