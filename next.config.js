/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.etsystatic.com',
      'img.clerk.com',
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Suppress Clerk headers warnings in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

module.exports = nextConfig;