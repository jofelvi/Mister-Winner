import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  outputFileTracingIncludes: {
    '/': ['**/*'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
  },
};

export default nextConfig;
