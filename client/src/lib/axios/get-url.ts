import { isDocker } from '../constants/env';
import { AxiosTypes } from '../types/axios';

const microserviceToPortMapper: AxiosTypes.MicroserviceToPortMapper = {
  auth:
    process.env.AUTH_MICROSERVICE_PORT ||
    process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_PORT!,
  tickets:
    process.env.TICKETS_MICROSERVICE_PORT ||
    process.env.NEXT_PUBLIC_TICKETS_MICROSERVICE_PORT!,
  orders:
    process.env.ORDERS_MICROSERVICE_PORT ||
    process.env.NEXT_PUBLIC_ORDERS_MICROSERVICE_PORT!,
  payments:
    process.env.PAYMENTS_MICROSERVICE_PORT ||
    process.env.NEXT_PUBLIC_PAYMENTS_MICROSERVICE_PORT!,
};

const microserviceToNameMapper: AxiosTypes.MicroserviceToNameMapper = {
  auth: process.env.AUTH_MICROSERVICE_NAME!,
  tickets: process.env.TICKETS_MICROSERVICE_NAME!,
  orders: process.env.ORDERS_MICROSERVICE_NAME!,
  payments: process.env.PAYMENTS_MICROSERVICE_NAME!,
};

const getUrl = (
  endpoint: string,
  microservice: AxiosTypes.MicroServices,
  isServer = false
) => {
  console.log('isDocker?', isDocker());
  console.log('NEXT_PUBLIC_API_URL: ', process.env.NEXT_PUBLIC_API_URL);
  console.log(
    'microserviceToPortMapper: ',
    JSON.stringify(microserviceToPortMapper, undefined, 2)
  );
  console.log('microservice: ', microservice);
  console.log(
    'microserviceToPortMapper[microservice!]: ',
    microserviceToPortMapper[microservice!]
  );
  console.log('endpoint: ', endpoint);
  console.log(
    'url: ',
    `${process.env.NEXT_PUBLIC_API_URL}:${
      microserviceToPortMapper[microservice!]
    }/${endpoint}`
  );
  if (isServer)
    return `http://${microserviceToNameMapper[microservice!]}:${
      microserviceToPortMapper[microservice!]
    }/${endpoint}`;
  return isDocker()
    ? `${process.env.NEXT_PUBLIC_API_URL}:${
        microserviceToPortMapper[microservice!]
      }/${endpoint}`
    : `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
};

export default getUrl;
