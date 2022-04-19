import { IS_DOCKER } from '../constants/env';
import { AxiosTypes } from '../types/axios';

const microserviceToPortMapper: AxiosTypes.MicroserviceToPortMapper = {
  auth: process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_PORT!,
};

const getUrl = (endpoint: string, microservice?: AxiosTypes.MicroServices) => {
  return IS_DOCKER
    ? `${process.env.NEXT_PUBLIC_API_URL}:${
        microserviceToPortMapper[microservice!]
      }/${endpoint}`
    : `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
};

export default getUrl;
