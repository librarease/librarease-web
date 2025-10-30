import { WithCommon } from './common'
import { Staff } from './staff'

export type JobType = 'export:borrowings' | 'import:books'
export type JobStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type Job = WithCommon<{
  type: JobType
  staff_id: string
  status: JobStatus
  payload: string
  result: string
  error: string | null
  started_at: string | null
  finished_at: string | null
  staff: Staff
}>

export type JobDetail = Omit<Job, 'staff'> & {
  staff: Staff
}
