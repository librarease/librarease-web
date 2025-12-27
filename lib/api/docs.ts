// import { BASE_URL } from './common'

// NOTE: static generation only, so we can use NEXT_PUBLIC_APP_URL

const TERMS_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/terms`

export const getTermsDoc = async (): Promise<string> => {
  const url = new URL(TERMS_URL)

  const response = await fetch(url.toString())
  return response.text()
}

const PRIVACY_URL = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/privacy`

export const getPrivacyDoc = async (): Promise<string> => {
  const url = new URL(PRIVACY_URL)

  const response = await fetch(url.toString())
  return response.text()
}
