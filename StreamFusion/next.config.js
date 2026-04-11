/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    strict: true,
  },
  swcMinify: true,
  experimental: {
    streaming: true,
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'StreamFusion',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

module.exports = nextConfig;
