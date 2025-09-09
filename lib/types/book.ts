import { WithCommon } from './common'
import { Library } from './library'

type BookStats = {
  borrow_count: number
  is_available: boolean
}

export type Book = WithCommon<{
  title: string
  author: string
  year: number
  code: string
  cover?: string
  library_id: string
  library?: Pick<Library, 'id' | 'name'>
  stats?: BookStats
}>

export type BookDetail = Omit<Book, 'library'> & {
  library: Library
}
