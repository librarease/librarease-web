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
