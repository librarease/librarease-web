import { GetUploadURLResponse } from '../api/file'
import { WithCommon } from './common'
import { Library } from './library'
import { Watchlist } from './watchlist'

export type BookStats = {
  borrow_count: number
  borrowing?: {
    returning?: { returned_at?: string }
    lost?: { reported_at?: string }
  }
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
  watchlists?: Watchlist[]
}>

export type BookDetail = Omit<Book, 'library'> & {
  library: Library
}

export type ImportBookPreview = Pick<GetUploadURLResponse, 'path'> & {
  summary: {
    created_count: number
    updated_count: number
    invalid_count: number
  }
  rows: Array<
    Pick<Book, 'code' | 'title' | 'author'> & {
      status: 'create' | 'update' | 'invalid'
      id?: string
      error?: string
    }
  >
}
