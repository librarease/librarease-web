import { Membership } from '../types/membership'
import { QueryParams, ResList, ResSingle } from '../types/common'
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

type GetBookQuery = Pick<Membership, 'id'>
type GetBookResponse = Promise<ResSingle<Membership>>
export const getBook = async (query: GetBookQuery): GetBookResponse => {
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
