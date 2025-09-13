import { BASE_URL } from './common'
import { Book } from '@/lib/types/book'
import { QueryParams, ResList } from '@/lib/types/common'

const WATCHLIST_URL = `${BASE_URL}/users/me/watchlist`

export const addToWatchlist = async (bookId: string, init?: RequestInit) => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const url = new URL(WATCHLIST_URL)
  const response = await fetch(url.toString(), {
    ...init,
    method: 'POST',
    headers,
    body: JSON.stringify({ book_id: bookId }),
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

export const removeFromWatchlist = async (
  bookId: string,
  init?: RequestInit
) => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const url = new URL(`${WATCHLIST_URL}/${bookId}`)
  const response = await fetch(url.toString(), {
    ...init,
    method: 'DELETE',
    headers,
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

type GetListWatchlistQuery = QueryParams<
  Pick<Book, 'id' | 'title' | 'library_id'>
> & {
  include_stats?: 'true'
}
type GetListWatchlistResponse = Promise<ResList<Book>>

export const getListWatchlist = async (
  query: GetListWatchlistQuery,
  init?: RequestInit
): GetListWatchlistResponse => {
  const url = new URL(WATCHLIST_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString(), init)
  return response.json()
}
