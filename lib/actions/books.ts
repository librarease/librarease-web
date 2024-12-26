'use server'

import { createBook } from '../api/book'
import { Book } from '../types/book'

export async function registerBook({
  title,
  author,
  year,
  code,
  library_id,
}: Pick<Book, 'title' | 'author' | 'year' | 'code' | 'library_id'>) {
  try {
    createBook({
      title,
      author,
      year: Number(year),
      code,
      library_id,
    })
  } catch (e) {
    throw {
      message: e.error,
    }
  }
}
