import { BASE_URL } from './common'

// Fetched at request time (never during `next build`, where the API is not
// reachable) and cached for an hour.
const getDoc = async (name: 'terms' | 'privacy'): Promise<string> => {
  const response = await fetch(`${BASE_URL}/${name}`, {
    next: { revalidate: 3600 },
  })
  if (!response.ok) {
    throw new Error(`Failed to load ${name} document: ${response.status}`)
  }
  return response.text()
}

export const getTermsDoc = () => getDoc('terms')

export const getPrivacyDoc = () => getDoc('privacy')
