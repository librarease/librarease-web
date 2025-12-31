import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  typedRoutes: true,

  experimental: {
    viewTransition: true,
  },

  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  reactCompiler: true,

  rewrites: async () => {
    if (process.env.NODE_ENV === 'production') {
      return []
    }
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
