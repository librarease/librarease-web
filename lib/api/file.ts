import { BASE_URL } from '@/lib/api/common'

const FILES_URL = `${BASE_URL}/files`

type GetUploadURLQuery = {
  name: string
}
export type GetUploadURLResponse = { url: string; path: string }
export const getUploadURL = async (
  query: GetUploadURLQuery,
  init?: RequestInit
): Promise<GetUploadURLResponse> => {
  const url = new URL(`${FILES_URL}/upload`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    headers,
  }
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString(), init)
  return response.json()
}
