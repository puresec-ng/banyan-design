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
  async redirects() {
    return [
      {
        source: '/submit-claim',
        destination: '/request-support',
        permanent: true,
      },
      {
        source: '/submit-claim/:path*',
        destination: '/request-support',
        permanent: true,
      },
      {
        source: '/favicon.ico',
        destination: '/real-favicon.ico',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/portal/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow, noarchive',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://salesiq.zohopublic.com https://static.zohocdn.com https://js.zohocdn.com",
              "style-src 'self' 'unsafe-inline' https://static.zohocdn.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data: https://static.zohocdn.com",
              "connect-src 'self' https://api.banyanclaims.com https://images.unsplash.com https://salesiq.zohopublic.com https://salesiq.zoho.com https://static.zohocdn.com https://js.zohocdn.com",
              "frame-src 'self' https://salesiq.zohopublic.com https://salesiq.zoho.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
  // Explicitly set the Turbopack root directory to prevent lockfile warnings
  turbopack: {
    root: __dirname,
  },
  // Strip console.* calls from production bundles so users don't see debug logs
  compiler: {
    removeConsole: {
      // Keep console.error for critical error reporting
      exclude: ['error'],
    },
  },
}

module.exports = nextConfig
