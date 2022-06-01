import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const IS_DOCKER =
  publicRuntimeConfig.NEXT_PUBLIC_ENV === 'production-docker' ||
  publicRuntimeConfig.NEXT_PUBLIC_ENV === 'development-docker';
