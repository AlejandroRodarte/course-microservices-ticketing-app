export namespace SupertestTypes {
  export type SignUpAndGetCookieFunction = () => Promise<
    [{ email: string; password: string }, string[]]
  >;
}
