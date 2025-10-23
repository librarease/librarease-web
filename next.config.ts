import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  typedRoutes: true,

  experimental: {
    // for event source stream
    proxyTimeout: 0,
    viewTransition: true,
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  reactCompiler: true,

  /* config options here */
  env: {
    API_URL: process.env.API_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    APP_URL: process.env.APP_URL,
    LIBRARY_COOKIE_NAME: process.env.LIBRARY_COOKIE_NAME,
  },

  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ]
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-sharing.s3.ap-southeast-1.amazonaws.com',
        port: '',
        pathname: '/public/**',
        search: '',
      },
      {
        protocol: 'https',
        hostname: 'assets.librarease.org',
        pathname: '/librarease/public/**',
        search: '',
      },
    ],
  },
}

export default nextConfig
