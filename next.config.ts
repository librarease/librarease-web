import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',

  /* config options here */
  env: {
    API_URL: process.env.API_URL,
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
  },

  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_URL}/api/:path*`,
      },
    ]
  },
}

export default nextConfig
