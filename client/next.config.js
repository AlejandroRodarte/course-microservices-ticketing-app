/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev) config.watchOptions.poll = 300;
    return config;
  },
  serverRuntimeConfig: {
    AUTH_MICROSERVICE_NAME: process.env.AUTH_MICROSERVICE_NAME,
    AUTH_MICROSERVICE_PORT: process.env.AUTH_MICROSERVICE_PORT,
    TICKETS_MICROSERVICE_NAME: process.env.TICKETS_MICROSERVICE_NAME,
    TICKETS_MICROSERVICE_PORT: process.env.TICKETS_MICROSERVICE_PORT,
    ORDERS_MICROSERVICE_NAME: process.env.ORDERS_MICROSERVICE_NAME,
    ORDERS_MICROSERVICE_PORT: process.env.ORDERS_MICROSERVICE_PORT,
    PAYMENTS_MICROSERVICE_NAME: process.env.PAYMENTS_MICROSERVICE_NAME,
    PAYMENTS_MICROSERVICE_PORT: process.env.PAYMENTS_MICROSERVICE_PORT,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
};

module.exports = nextConfig;
