export namespace AxiosTypes {
  export type MicroServices = 'auth';
  export type MicroserviceToPortMapper = {
    [K in MicroServices]: string;
  };
  export type Methods = 'get' | 'post' | 'put' | 'delete';
}
