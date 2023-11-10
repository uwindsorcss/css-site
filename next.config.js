/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["css.uwindsor.ca"],
    },
  },
};

module.exports = nextConfig;
