import { WithCommon } from './common'
import { Library } from './library'

export type Book = WithCommon<{
  title: string
  author: string
  year: number
  code: string
  cover?: string
  library_id: string
  library?: Pick<Library, 'id' | 'name'>
}>

export type BookDetail = Omit<Book, 'library'> & {
  library: Library
}
