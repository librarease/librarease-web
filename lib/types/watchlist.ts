import { WithCommon } from './common'

export type Watchlist = WithCommon<{
  id: string
  user_id: string
  book_id: string
  created_at: Date
  updated_at: Date
}>
