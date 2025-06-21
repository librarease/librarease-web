import { BASE_URL } from '@/lib/api/common'

const FILES_URL = `${BASE_URL}/files`

export const getUploadURL = async (query: {
  name: string
}): Promise<{ url: string }> => {
  const url = new URL(`${FILES_URL}/upload`)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}
