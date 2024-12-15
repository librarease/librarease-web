import { QueryParams, ResList, ResSingle } from '../types/common'
import { User } from '../types/user'
import { BASE_URL } from './common'

const USERS_URL = `${BASE_URL}/users`

type GetListUsersQuery = QueryParams<User>
type GetListUsersResponse = Promise<ResList<User>>

export const getListUsers = async (
  query: GetListUsersQuery
): GetListUsersResponse => {
  const url = new URL(USERS_URL)
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

type GetUserQuery = Pick<User, 'id'>
type GetUserResponse = Promise<ResSingle<User>>

export const getUser = async (query: GetUserQuery): GetUserResponse => {
  const url = new URL(`${USERS_URL}/${query.id}`)
  const response = await fetch(url.toString())
  return response.json()
}
