import { QueryParams, ResList, ResSingle } from '../types/common'
import { Review } from '../types/review'
import { BASE_URL } from './common'

const REVIEWS_URL = `${BASE_URL}/reviews`

type GetListReviewsQuery = QueryParams<
  Pick<Review, 'borrowing_id' | 'rating' | 'comment'>
> & {
  user_id?: string
  book_id?: string
  library_id?: string
}
type GetListReviewsResponse = Promise<ResList<Review>>

export const getListReviews = async (
  query: GetListReviewsQuery,
  init?: RequestInit
): GetListReviewsResponse => {
  const url = new URL(REVIEWS_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

export const createReview = async (
  body: Pick<Review, 'borrowing_id' | 'rating' | 'comment'>,
  init?: RequestInit
): Promise<ResSingle<Review>> => {
  const url = new URL(REVIEWS_URL)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

type GetReviewQuery = Pick<
  GetListReviewsQuery,
  | 'borrowing_id'
  | 'book_id'
  | 'user_id'
  | 'library_id'
  | 'rating'
  | 'comment'
  | 'sort_by'
  | 'sort_in'
>
export const getReview = async (
  id: string,
  query?: GetReviewQuery,
  init?: RequestInit
): Promise<ResSingle<Review>> => {
  const url = new URL(`${REVIEWS_URL}/${id}`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    headers,
  }
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value) {
        url.searchParams.append(key, String(value))
      }
    })
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

type UpdateReviewQuery = Pick<Review, 'rating' | 'comment'>
export const updateReview = async (
  id: string,
  query: UpdateReviewQuery,
  init?: RequestInit
): Promise<ResSingle<Review>> => {
  const url = new URL(`${REVIEWS_URL}/${id}`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    method: 'PUT',
    headers,
    body: JSON.stringify(query),
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

export const deleteReview = async (
  id: string,
  init?: RequestInit
): Promise<ResSingle<null>> => {
  const url = new URL(`${REVIEWS_URL}/${id}`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    method: 'DELETE',
    headers,
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}
