import { IS_DOCKER } from '../constants/env';

const getUrl = (endpoint: string) => {
  return IS_DOCKER
    ? `${process.env.NEXT_PUBLIC_API_URL}:${process.env.NEXT_PUBLIC_AUTH_MICROSERVICE_PORT}/${endpoint}`
    : `${process.env.NEXT_PUBLIC_API_URL}/${endpoint}`;
};

export default getUrl;
