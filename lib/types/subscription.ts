import { WithCommon } from './common'
import { Membership } from './membership'
import { User } from './user'

export type Subscription = WithCommon<{
  user_id: string
  membership_id: string
  expires_at: string
  amount: number
  loan_period: number
  active_loan_limit: number
  usage_limit: number
  user: Pick<User, 'id' | 'name'>
  membership: Pick<Membership, 'id' | 'name' | 'library_id' | 'library'>
  fine_per_day: number
}>

export type SubscriptionDetail = Omit<Subscription, 'user' | 'membership'> & {
  usage_count?: number
  active_loan_count?: number
  user: User
  membership: Membership
}
