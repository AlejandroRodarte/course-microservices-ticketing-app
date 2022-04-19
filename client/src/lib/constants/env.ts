export const IS_DOCKER =
  process.env.NEXT_PUBLIC_ENV === 'production-docker' ||
  process.env.NEXT_PUBLIC_ENV === 'development-docker';
