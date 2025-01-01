import { QueryParams, ResList, ResSingle } from '../types/common'
import { Library } from '../types/library'
import { BASE_URL } from './common'

const LIBRARIES_URL = `${BASE_URL}/libraries`

type GetListLibrariesQuery = QueryParams<Library>
type GetListLibrariesResponse = Promise<ResList<Library>>

export const getListLibraries = async (
  query: GetListLibrariesQuery
): GetListLibrariesResponse => {
  const url = new URL(LIBRARIES_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })
  try {
    const response = await fetch(url.toString())
    return response.json()
  } catch (error) {
    return {
      error: 'Request failed',
      message: error as string,
    }
  }
}

type GetLibraryQuery = Pick<Library, 'id'>
type GetLibraryResponse = Promise<ResSingle<Library>>

export const getLibrary = async (
  query: GetLibraryQuery
): GetLibraryResponse => {
  const url = new URL(`${LIBRARIES_URL}/${query.id}`)
  const response = await fetch(url.toString())
  return response.json()
}

type CreateLibraryQuery = Pick<
  Library,
  'name' | 'logo' | 'address' | 'phone' | 'email' | 'description'
>
type CreateLibraryResponse = Promise<ResSingle<Pick<Library, 'id'>>>
export const createLibrary = async (
  query: CreateLibraryQuery,
  init?: RequestInit
): CreateLibraryResponse => {
  const response = await fetch(LIBRARIES_URL, {
    ...init,
    method: 'POST',
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

type UpdateLibraryData = Pick<
  Library,
  'name' | 'logo' | 'address' | 'phone' | 'email' | 'description'
>
type UpdateLibraryResponse = Promise<ResSingle<Library>>
export const updateLibrary = async (
  id: Library['id'],
  data: UpdateLibraryData,
  init?: RequestInit
): UpdateLibraryResponse => {
  const url = new URL(`${LIBRARIES_URL}/${id}`)
  const response = await fetch(url.toString(), {
    ...init,
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      ...init?.headers,
      'Content-Type': 'application/json',
    },
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}
