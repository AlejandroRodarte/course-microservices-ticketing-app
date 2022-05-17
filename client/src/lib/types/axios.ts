export namespace AxiosTypes {
  export type MicroServices = 'auth' | 'tickets' | 'orders';
  export type MicroserviceToPortMapper = {
    [K in MicroServices]: string;
  };
  export type MicroserviceToNameMapper = MicroserviceToPortMapper
  export type Methods = 'get' | 'post' | 'put' | 'delete';
}
