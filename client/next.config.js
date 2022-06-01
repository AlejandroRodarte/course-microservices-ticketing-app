/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    if (dev) config.watchOptions.poll = 300;
    return config;
  },
};

module.exports = nextConfig;
