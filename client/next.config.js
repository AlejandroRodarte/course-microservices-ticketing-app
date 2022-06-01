/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev) config.watchOptions.poll = 300;
    return config;
  },
  experimental: {
    outputStandalone: true,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_ENV: process.env.NEXT_PUBLIC_ENV,
  },
};

module.exports = nextConfig;
