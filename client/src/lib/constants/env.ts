export const isDocker = () => {
  console.log('isDocker: ', process.env.NEXT_PUBLIC_ENV);
  return (
    process.env.NEXT_PUBLIC_ENV === 'production-docker' ||
    process.env.NEXT_PUBLIC_ENV === 'development-docker'
  );
};
