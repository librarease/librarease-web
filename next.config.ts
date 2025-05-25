import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  experimental: {
    // for event source stream
    proxyTimeout: 0,
  },

  /* config options here */
  env: {
    API_URL: process.env.API_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    APP_URL: process.env.APP_URL,
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
        protocol: 'http',
        hostname: '13.212.97.184',
        port: '9000',
        pathname: '/librarease/public/**',
        search: '',
      },
    ],
  },
}

export default nextConfig
