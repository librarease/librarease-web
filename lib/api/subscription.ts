import { QueryParams, ResList, ResSingle } from '../types/common'
import { Subscription } from '../types/subscription'
import { BASE_URL } from './common'

const SUBSCRIPTIONS_URL = `${BASE_URL}/subscriptions`

type GetListSubsQuery = QueryParams<
  Subscription & {
    membership_name: string
    is_active?: boolean
  }
>
type GetListSubsResponse = Promise<ResList<Subscription>>

export const getListSubs = async (
  query: GetListSubsQuery
): GetListSubsResponse => {
  const url = new URL(SUBSCRIPTIONS_URL)
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

type GetUserQuery = Pick<Subscription, 'id'>
type GetUserResponse = Promise<ResSingle<Subscription>>

export const getUser = async (query: GetUserQuery): GetUserResponse => {
  const url = new URL(`${SUBSCRIPTIONS_URL}/${query.id}`)
  const response = await fetch(url.toString())
  return response.json()
}
