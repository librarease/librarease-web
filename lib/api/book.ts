import { Book, BookDetail, ImportBookPreview } from '@/lib/types/book'
import { QueryParams, ResList, ResSingle } from '@/lib/types/common'
import { BASE_URL } from './common'
import { GetUploadURLResponse } from './file'

const BOOKS_URL = `${BASE_URL}/books`

type GetListBooksQuery = QueryParams<
  Pick<Book, 'id' | 'title' | 'library_id'>
> & {
  include_stats?: 'true'
  ids?: string[]
}
type GetListBooksResponse = Promise<ResList<Book>>

export const getListBooks = async ({
  ids,
  ...query
}: GetListBooksQuery): GetListBooksResponse => {
  const url = new URL(BOOKS_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })
  if (ids && ids.length > 0) {
    url.searchParams.append('ids', ids.join(','))
  }

  const response = await fetch(url.toString(), {
    cache: 'force-cache',
    next: {
      revalidate: 60,
    },
  })
  return response.json()
}

type GetBookQuery = Pick<Book, 'id'> & {
  include_stats?: 'true'
  user_id?: string
}
type GetBookResponse = Promise<ResSingle<BookDetail>>
export const getBook = async (query: GetBookQuery): GetBookResponse => {
  const url = new URL(`${BOOKS_URL}/${query.id}`)
  Object.entries(query).forEach(([key, value]) => {
    if (key !== 'id' && value) {
      url.searchParams.append(key, String(value))
    }
  })
  const response = await fetch(url.toString())
  return response.json()
}

type CreateBookQuery = Pick<
  Book,
  | 'title'
  | 'author'
  | 'year'
  | 'code'
  | 'library_id'
  | 'cover'
  | 'colors'
  | 'description'
>
type CreateBookResponse = Promise<ResSingle<Pick<Book, 'id'>>>
export const createBook = async (
  query: CreateBookQuery,
  init?: RequestInit
): CreateBookResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(BOOKS_URL, {
    ...init,
    method: 'POST',
    headers,
    body: JSON.stringify(query),
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

type UpdateBookQuery = Pick<
  Book,
  'title' | 'author' | 'year' | 'code' | 'colors' | 'description'
> & {
  update_cover?: string
}
export const updateBook = async (
  bookId: string,
  query: UpdateBookQuery,
  init?: RequestInit
): Promise<ResSingle<Pick<Book, 'id'>>> => {
  const url = new URL(`${BOOKS_URL}/${bookId}`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(url.toString(), {
    ...init,
    method: 'PUT',
    headers,
    body: JSON.stringify(query),
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

type ImportBookQuery = Pick<GetUploadURLResponse, 'path'> & {
  library_id: string
}
type PreviewBookImportResponse = Promise<ResSingle<ImportBookPreview>>
export const previewBookImport = async (
  query: ImportBookQuery,
  init?: RequestInit
): PreviewBookImportResponse => {
  const url = new URL(`${BOOKS_URL}/import`)
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

export const importBooks = async (
  body: ImportBookQuery,
  init?: RequestInit
): Promise<
  ResSingle<{
    id: string
  }>
> => {
  const url = new URL(`${BOOKS_URL}/import`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }
  const response = await fetch(url.toString(), init)
  return response.json()
}
