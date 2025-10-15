import { QueryParams, ResList, ResSingle } from '../types/common'
import { Job, JobDetail } from '../types/job'
import { BASE_URL } from './common'

const JOBS_URL = `${BASE_URL}/jobs`

type GetListJobsQuery = QueryParams<
  Pick<Job, 'status' | 'type'> & { library_id: string }
>
type GetListJobsResponse = Promise<ResList<Job>>

export const getListJobs = async (
  query: GetListJobsQuery,
  init?: RequestInit
): GetListJobsResponse => {
  const url = new URL(JOBS_URL)
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

export const getJob = async (
  id: string,
  init?: RequestInit
): Promise<ResSingle<JobDetail>> => {
  const url = new URL(`${JOBS_URL}/${id}`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    headers,
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}

export const downloadJobResult = async (
  id: string,
  init?: RequestInit
): Promise<ResSingle<{ url: string }>> => {
  const url = new URL(`${JOBS_URL}/${id}/download`)
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  init = {
    ...init,
    headers,
  }
  const response = await fetch(url.toString(), init)
  if (!response.ok) {
    const e = await response.json()
    throw e
  }
  return response.json()
}
