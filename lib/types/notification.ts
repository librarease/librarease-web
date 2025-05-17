import { WithCommon } from './common'

export type Notification = WithCommon<{
  title: string
  message: string
  read_at?: Date
  reference_id?: string
  reference_type: string
}>
