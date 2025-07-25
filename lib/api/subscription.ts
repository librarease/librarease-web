import { QueryParams, ResList, ResSingle } from '../types/common'
import { Subscription, SubscriptionDetail } from '../types/subscription'
import { BASE_URL } from './common'

const SUBSCRIPTIONS_URL = `${BASE_URL}/subscriptions`

type GetListSubsQuery = QueryParams<
  Subscription & {
    membership_name: string
    is_active?: boolean
    status?: 'active' | 'expired'
  }
>
type GetListSubsResponse = Promise<ResList<Subscription>>

export const getListSubs = async (
  { status, ...query }: GetListSubsQuery,
  init?: RequestInit
): GetListSubsResponse => {
  const url = new URL(SUBSCRIPTIONS_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  if (status) {
    if (status === 'active') {
      url.searchParams.append('is_active', 'true')
    } else if (status === 'expired') {
      url.searchParams.append('is_expired', 'true')
    }
  }

  try {
    const response = await fetch(url.toString(), init)
    if (!response.ok) {
      const e = await response.json()
      throw e
    }
    return response.json()
  } catch (error) {
    return {
      error: 'Request failed',
      message: error as string,
    }
  }
}

type GetSubscriptionQuery = Pick<Subscription, 'id'>
type GetSubscriptionResponse = Promise<ResSingle<SubscriptionDetail>>

export const getSubscription = async (
  query: GetSubscriptionQuery
): GetSubscriptionResponse => {
  const url = new URL(`${SUBSCRIPTIONS_URL}/${query.id}`)
  const response = await fetch(url.toString())
  return response.json()
}

type CreateSubscription = Pick<Subscription, 'user_id' | 'membership_id'>
type CreateSubscriptionResponse = Promise<ResSingle<Pick<Subscription, 'id'>>>
export const createSubscription = async (
  body: CreateSubscription
): CreateSubscriptionResponse => {
  const res = await fetch(SUBSCRIPTIONS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const e = await res.json()
    throw e
  }
  return res.json()
}
