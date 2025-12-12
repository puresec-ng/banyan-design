/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://api.banyanclaims.com/api/v1/:path*',
      },
    ];
  },
  // Explicitly set the Turbopack root directory to prevent lockfile warnings
  turbopack: {
    root: __dirname,
  },
}

module.exports = nextConfig 