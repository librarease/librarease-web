import { Collection, CollectionBook } from '@/lib/types/collection'
import { QueryParams, ResList, ResSingle } from '@/lib/types/common'
import { BASE_URL } from './common'

const COLLECTION_URL = `${BASE_URL}/collections`

type GetListCollectionsQuery = QueryParams<
  Pick<Collection, 'id' | 'title' | 'library_id'>
> & { include_stats?: 'true' }
type GetListCollectionsResponse = Promise<ResList<Collection>>
export const getListCollections = async (
  query: GetListCollectionsQuery,
  init?: RequestInit
): GetListCollectionsResponse => {
  const url = new URL(COLLECTION_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString(), init)
  return response.json()
}

type GetCollectionQuery = {
  include_books?: 'true'
  include_book_ids?: 'true'
  include_stats?: 'true'
}
type GetCollectionResponse = Promise<ResSingle<Collection>>
export const getCollection = async (
  id: string,
  query?: GetCollectionQuery,
  init?: RequestInit
): GetCollectionResponse => {
  const url = new URL(`${COLLECTION_URL}/${id}`)
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString(), init)
  return response.json()
}

type CreateCollectionQuery = Pick<
  Collection,
  'title' | 'library_id' | 'description' | 'cover' | 'colors'
>
type CreateCollectionResponse = Promise<
  ResSingle<Omit<Collection, 'library' | 'cover'>>
>
export const createCollection = async (
  query: CreateCollectionQuery,
  init?: RequestInit
): CreateCollectionResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(COLLECTION_URL, {
    ...init,
    method: 'POST',
    body: JSON.stringify(query),
    headers,
  })
  if (!res.ok) {
    const e = await res.json()
    throw new Error(e.error)
  }
  return res.json()
}

export const deleteCollection = async (
  id: string,
  init?: RequestInit
): Promise<ResSingle<undefined>> => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${COLLECTION_URL}/${id}`, {
    ...init,
    method: 'DELETE',
    headers,
  })
  if (!res.ok) {
    const e = await res.json()
    throw new Error(e.message)
  }
  return res.json()
}

type UpdateCollectionQuery = Partial<
  Pick<Collection, 'title' | 'description' | 'colors'> & {
    update_cover: string
  }
>
export const updateCollection = async (
  id: string,
  query: UpdateCollectionQuery,
  init?: RequestInit
): CreateCollectionResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${COLLECTION_URL}/${id}`, {
    ...init,
    method: 'PUT',
    headers,
    body: JSON.stringify(query),
  })
  if (!res.ok) {
    const e = await res.json()
    throw new Error(e.message)
  }
  return res.json()
}

type GetListCollectionBooksQuery = QueryParams<
  Partial<{
    include_book: 'true'
    book_title: string
    book_sort_by: 'title' | 'created_at' | 'updated_at'
    book_sort_in: 'asc' | 'desc'
  }>
>
type GetListCollectionBooksResponse = Promise<ResList<CollectionBook>>
export const getListCollectionBooks = async (
  collection_id: string,
  query: GetListCollectionBooksQuery
): GetListCollectionBooksResponse => {
  const url = new URL(`${COLLECTION_URL}/${collection_id}/books`)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}

type UpdateCollectionBooksQuery = { book_ids: string[] }
type UpdateCollectionBooksResponse = Promise<
  ResList<Omit<CollectionBook, 'book'>>
>
export const updateCollectionBooks = async (
  collection_id: string,
  query: UpdateCollectionBooksQuery,
  init?: RequestInit
): UpdateCollectionBooksResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${COLLECTION_URL}/${collection_id}/books`, {
    ...init,
    method: 'PUT',
    headers,
    body: JSON.stringify(query),
  })
  if (!res.ok) {
    const e = await res.json()
    throw new Error(e.message)
  }
  return res.json()
}

export const followCollection = async (
  id: string,
  init?: RequestInit
): Promise<ResSingle<undefined>> => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${COLLECTION_URL}/${id}/follow`, {
    ...init,
    method: 'POST',
    headers,
  })
  if (!res.ok) {
    const e = await res.json()
    throw new Error(e.message)
  }
  return res.json()
}

export const unfollowCollection = async (
  id: string,
  init?: RequestInit
): Promise<ResSingle<undefined>> => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  const res = await fetch(`${COLLECTION_URL}/${id}/follow`, {
    ...init,
    method: 'DELETE',
    headers,
  })
  if (!res.ok) {
    const e = await res.json()
    throw new Error(e.message)
  }
  return res.json()
}
