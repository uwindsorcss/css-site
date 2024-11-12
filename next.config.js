/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["css.uwindsor.ca"],
    },
  },
  async redirects() {
    return [
      {
        source: "/ww",
        destination: "/events?filter=Upcoming",
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['res.cloudinary.com'],
  }
};

module.exports = nextConfig;
