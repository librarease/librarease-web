import { Membership } from '@/lib/types/membership'
import { QueryParams, ResList, ResSingle } from '@/lib/types/common'
import { BASE_URL } from './common'

const MEMBERSHIPS_URL = `${BASE_URL}/memberships`

type GetListMembershipsQuery = QueryParams<Membership> & {
  library_ids?: string
}
type GetListMembershipsResponse = Promise<ResList<Membership>>

export const getListMemberships = async (
  query: GetListMembershipsQuery
): GetListMembershipsResponse => {
  const url = new URL(MEMBERSHIPS_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}

type GetMembershipQuery = Pick<Membership, 'id'>
type GetMembershipResponse = Promise<ResSingle<Membership>>
export const getMembership = async (
  query: GetMembershipQuery
): GetMembershipResponse => {
  const url = new URL(`${MEMBERSHIPS_URL}/${query.id}`)
  const response = await fetch(url.toString())
  return response.json()
}

type CreateMembershipQuery = Pick<
  Membership,
  'name' | 'active_loan_limit' | 'duration' | 'loan_period' | 'library_id'
>
type CreateMembershipResponse = Promise<ResSingle<Pick<Membership, 'id'>>>
export const createMembership = async (
  query: CreateMembershipQuery
): CreateMembershipResponse => {
  const response = await fetch(MEMBERSHIPS_URL, {
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

type UpdateMembershipQuery = {
  id: string
} & Partial<CreateMembershipQuery>
type UpdateMembershipResponse = Promise<ResSingle<Membership>>
export const updateMembership = async (
  query: UpdateMembershipQuery,
  options?: { headers?: HeadersInit }
): UpdateMembershipResponse => {
  const { id, ...data } = query
  const response = await fetch(`${MEMBERSHIPS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    body: JSON.stringify(data),
  })

  // Attempt to parse json error if response is not ok
  if (!response.ok) {
    const e = await response.json().catch(() => ({ error: 'Unknown error occurred' }))
    throw e
  }
  return response.json()
}
