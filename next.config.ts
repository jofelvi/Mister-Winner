import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
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
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  // Enable static optimization
  trailingSlash: false,
  // Optimize bundling
  experimental: {
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
};

export default nextConfig;
