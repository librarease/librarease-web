export const BASE_URL =
  typeof window === 'undefined'
    ? `${process.env.API_URL}/api/v1`
    : `${process.env.NEXT_PUBLIC_APP_URL}/api/v1`
