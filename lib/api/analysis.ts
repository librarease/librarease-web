import { Analysis } from '../types/analysis'
import { ResSingle } from '../types/common'
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
