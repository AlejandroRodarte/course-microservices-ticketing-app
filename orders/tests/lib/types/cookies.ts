export namespace CookieTestsTypes {
  export type CreateUserAndCookie = () => [
    { id: string; email: string; password: string },
    string[]
  ];
}
