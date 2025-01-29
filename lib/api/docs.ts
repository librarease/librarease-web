import { BASE_URL } from './common'

const TERMS_URL = `${BASE_URL}/terms`

export const getTermsDoc = async (): Promise<string> => {
  const url = new URL(TERMS_URL)

  const response = await fetch(url.toString())
  return response.text()
}

const PRIVACY_URL = `${BASE_URL}/privacy`

export const getPrivacyDoc = async (): Promise<string> => {
  const url = new URL(PRIVACY_URL)

  const response = await fetch(url.toString())
  return response.text()
}
