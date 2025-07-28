import { Borrow, BorrowDetail, Return } from '@/lib/types/borrow'
import { QueryParams, ResList, ResSingle } from '@/lib/types/common'
import { BASE_URL } from './common'

const BORROW_URL = `${BASE_URL}/borrowings`

type GetListBorrowsQuery = QueryParams<
  Borrow & {
    is_active?: boolean
    is_expired?: boolean
    library_id?: string
    status?: 'active' | 'overdue' | 'returned'
    user_id?: string
  }
>
type GetListBorrowsResponse = Promise<ResList<Borrow>>

export const getListBorrows = async (
  { status, ...query }: GetListBorrowsQuery,
  init?: RequestInit
): GetListBorrowsResponse => {
  const url = new URL(BORROW_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  if (status) {
    if (status === 'active') {
      url.searchParams.append('is_active', 'true')
    } else if (status === 'overdue') {
      url.searchParams.append('is_overdue', 'true')
    } else if (status === 'returned') {
      url.searchParams.append('is_returned', 'true')
    }
  }

  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }

  return response.json()
}

type GetBorrowQuery = Pick<Borrow, 'id'>
type GetBorrowResponse = Promise<ResSingle<BorrowDetail>>
export const getBorrow = async (query: GetBorrowQuery): GetBorrowResponse => {
  const url = new URL(`${BORROW_URL}/${query.id}`)
  const response = await fetch(url.toString())
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

export const createBorrow = async (
  data: Pick<Borrow, 'book_id' | 'subscription_id' | 'staff_id'>
): GetBorrowResponse => {
  const response = await fetch(BORROW_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const e = await response.json()
    throw e
  }

  return response.json()
}

export const returnBorrow = async (
  data: Pick<Borrow, 'id'> & Partial<Pick<Return, 'returned_at' | 'fine'>>,
  init?: RequestInit
): GetBorrowResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/${data.id}/return`, {
    ...init,
    method: 'POST',
    body: JSON.stringify(data),
    headers,
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }

  return response.json()
}

export type UpdateBorrowData = Pick<Borrow, 'id'> &
  Partial<Pick<Borrow, 'borrowed_at' | 'due_at'>> & {
    returning?: Pick<Return, 'returned_at' | 'fine'>
  }

export const updateBorrow = async (
  data: UpdateBorrowData,
  init?: RequestInit
): GetBorrowResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/${data.id}`, {
    ...init,
    method: 'PUT',
    body: JSON.stringify(data),
    headers,
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }

  return response.json()
}

export const deleteReturn = async (
  data: Pick<Borrow, 'id'>,
  init?: RequestInit
): GetBorrowResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/${data.id}/return`, {
    ...init,
    method: 'DELETE',
    body: JSON.stringify(data),
    headers,
  })
  if (!response.ok) {
    const e = await response.json()
    throw e
  }

  return response.json()
}
