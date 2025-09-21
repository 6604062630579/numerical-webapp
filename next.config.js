/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;
