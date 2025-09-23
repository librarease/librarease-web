import { Analysis } from '@/lib/types/analysis'
import { ResList, ResSingle } from '@/lib/types/common'
import { BASE_URL } from './common'

const ANSLYSIS_URL = `${BASE_URL}/analysis`

type GetAnalysisQuery = {
  limit: number
  skip?: number
  from: string
  to: string
  library_id: string
}
type GetAnalysisResponse = Promise<ResSingle<Analysis>>

export const getAnalysis = async (
  query: GetAnalysisQuery
): GetAnalysisResponse => {
  const url = new URL(ANSLYSIS_URL)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}

type AnalysisQueryParams =
  | {
      limit: number
      skip: number
      from: string
      to: string
      library_id: string
    }
  | {
      limit: number
      skip: number
      library_id: string
    }

export const getOverdueAnalysis = async (
  query: Omit<AnalysisQueryParams, 'limit' | 'skip'>
): Promise<
  ResList<{
    membership_id: string
    membership_name: string
    total: number
    overdue: number
    rate: number
  }>
> => {
  const url = new URL(`${ANSLYSIS_URL}/overdue`)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}

export const getBookUtilizationAnalysis = async (
  query: AnalysisQueryParams
): Promise<
  ResList<{
    book_id: string
    book_title: string
    copies: number
    total_borrowings: number
    utilization_rate: number
  }>
> => {
  const url = new URL(`${ANSLYSIS_URL}/book-utilization`)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}

export const getBorrowingHeatmapAnalysis = async (query: {
  library_id: string
  start?: string
  end?: string
}): Promise<
  ResList<{
    day_of_week: number
    hour_of_day: number
    count: number
  }>
> => {
  const url = new URL(`${ANSLYSIS_URL}/borrowing-heatmap`)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}

export const getPowerUsersAnalysis = async (
  query: GetAnalysisQuery
): Promise<
  ResList<{
    user_id: string
    user_name: string
    total_books: number
  }>
> => {
  const url = new URL(`${ANSLYSIS_URL}/power-users`)
  Object.entries(query).forEach(([key, value]) => {
    if (value) {
      url.searchParams.append(key, String(value))
    }
  })

  const response = await fetch(url.toString())
  return response.json()
}
