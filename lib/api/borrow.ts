import { Borrow, BorrowDetail, Lost, Return } from '@/lib/types/borrow'
import { QueryParams, ResList, ResSingle } from '@/lib/types/common'
import { BASE_URL } from './common'

const BORROW_URL = `${BASE_URL}/borrowings`

type GetListBorrowsQuery = QueryParams<
  Borrow & {
    is_active?: boolean
    is_expired?: boolean
    library_id?: string
    status?: 'active' | 'overdue' | 'returned' | 'lost'
    user_id?: string
    returned_at?: string
    lost_at?: string
    include_review?: 'true'
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
    } else if (status === 'lost') {
      url.searchParams.append('is_lost', 'true')
    }
  }

  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }

  return response.json()
}

export type GetBorrowQuery = Pick<Borrow, 'id'> &
  Pick<
    GetListBorrowsQuery,
    | 'book_id'
    | 'subscription_id'
    | 'user_id'
    | 'library_id'
    | 'borrowed_at'
    | 'due_at'
    | 'returned_at'
    | 'lost_at'
    | 'is_active'
    | 'is_expired'
    | 'sort_by'
    | 'sort_in'
    | 'status'
  >
type GetBorrowResponse = Promise<ResSingle<BorrowDetail>>
export const getBorrow = async (
  { id, status, ...query }: GetBorrowQuery,
  init?: RequestInit
): GetBorrowResponse => {
  const url = new URL(`${BORROW_URL}/${id}`)
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

  if (status) {
    if (status === 'active') {
      url.searchParams.append('is_active', 'true')
    } else if (status === 'overdue') {
      url.searchParams.append('is_overdue', 'true')
    } else if (status === 'returned') {
      url.searchParams.append('is_returned', 'true')
    } else if (status === 'lost') {
      url.searchParams.append('is_lost', 'true')
    }
  }
  const response = await fetch(url.toString(), init)
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

export const deleteBorrow = async (
  data: Pick<Borrow, 'id'>,
  init?: RequestInit
): GetBorrowResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/${data.id}`, {
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

export const lostBorrow = async (
  data: Pick<Borrow, 'id'> & Pick<Lost, 'reported_at' | 'fine' | 'note'>,
  init?: RequestInit
): Promise<ResSingle<Lost>> => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/${data.id}/lost`, {
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

export const deleteLost = async (
  data: Pick<Borrow, 'id'>,
  init?: RequestInit
): GetBorrowResponse => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/${data.id}/lost`, {
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

export type ExportBorrowingsData = {
  library_id: string
  is_active?: boolean
  is_overdue?: boolean
  is_returned?: boolean
  is_lost?: boolean
  borrowed_at_from: string
  borrowed_at_to: string
}

export const exportBorrows = async (
  data: ExportBorrowingsData,
  init?: RequestInit
): Promise<
  ResSingle<{
    id: string
  }>
> => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')

  const response = await fetch(`${BORROW_URL}/export`, {
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
