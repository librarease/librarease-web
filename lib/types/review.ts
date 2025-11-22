import { Book } from './book'
import { Borrow } from './borrow'
import { WithCommon } from './common'
import { User } from './user'

export type Review = WithCommon<{
  rating: number
  comment?: string
  borrowing_id: string
  borrowing: Pick<Borrow, 'subscription_id' | 'borrowed_at' | 'due_at'>
  user: Pick<User, 'id' | 'name' | 'email'>
  book: Pick<Book, 'title' | 'author' | 'code' | 'cover' | 'colors'>
}>

export type ReviewDetail = Review & {
  prev_id?: string
  next_id?: string
}
