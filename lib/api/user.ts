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

type CreateUserQuery = Pick<User, 'name' | 'email'>
type CreateBookResponse = Promise<ResSingle<Pick<User, 'id'>>>
export const createUser = async (
  query: CreateUserQuery
): CreateBookResponse => {
  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: {
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

type GetMeQuery = {
  include_unread_notifications_count?: boolean
}
type GetMeResponse = Promise<
  ResSingle<User & { unread_notifications_count: number }>
>

export const getMe = async (
  query: GetMeQuery,
  init?: RequestInit
): GetMeResponse => {
  const url = new URL(`${USERS_URL}/me`)
  if (query.include_unread_notifications_count) {
    url.searchParams.append('include', 'unread_notifications_count')
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}
