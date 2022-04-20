import { IS_DOCKER } from '../constants/env';
import { AxiosTypes } from '../types/axios';

const microserviceToPortMapper: AxiosTypes.MicroserviceToPortMapper = {
  auth:
    process.env.AUTH_MICROSERVICE_PORT ||
    process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_PORT!,
};

const microserviceToNameMapper: AxiosTypes.MicroserviceToNameMapper = {
  auth: process.env.AUTH_MICROSERVICE_NAME!,
};

const getUrl = (
  endpoint: string,
  microservice: AxiosTypes.MicroServices,
  isServer = false
) => {
  if (isServer)
    return `http://${microserviceToNameMapper[microservice!]}:${
      microserviceToPortMapper[microservice!]
    }/${endpoint}`;
  return IS_DOCKER
    ? `${process.env.NEXT_PUBLIC_API_URL}:${
        microserviceToPortMapper[microservice!]
      }/${endpoint}`
    : `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
};

export default getUrl;
