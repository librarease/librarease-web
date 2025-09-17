import { Asset } from './asset'
import { Book } from './book'
import { WithCommon } from './common'
import { Library } from './library'

export type Collection = WithCommon<{
  title: string
  description?: string
  library_id: string
  library?: Pick<Library, 'id' | 'name'>
  cover?: Asset

  book_count: number
  follower_count: number
  book_ids: string[]
}>

export type CollectionBook = WithCommon<{
  collection_id: string
  book_id: string
  book?: Book
}>
