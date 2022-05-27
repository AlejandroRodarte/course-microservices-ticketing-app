export namespace FormTypes {
  export interface CredentialsForm {
    email: string;
    password: string;
  }
  export type CredentialsFormKeys = keyof CredentialsForm;

  export interface TicketForm {
    title: string;
    price: string;
  }
  export type TicketFormKeys = keyof TicketForm;
}
