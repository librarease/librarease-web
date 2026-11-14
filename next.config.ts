import type { NextConfig } from 'next'

// Host of the S3 bucket that serves public assets (book covers, logos),
// e.g. my-bucket.s3.ap-southeast-1.amazonaws.com. Read at build time.
const s3AssetsHostname = process.env.S3_ASSETS_HOSTNAME

const nextConfig: NextConfig = {
  output: 'standalone',

  typedRoutes: true,

  experimental: {
    turbopackRustReactCompiler: true,
    useOffline: true,
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
      ...(s3AssetsHostname
        ? [
            {
              protocol: 'https' as const,
              hostname: s3AssetsHostname,
              port: '',
              pathname: '/public/**',
              search: '',
            },
          ]
        : []),
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
