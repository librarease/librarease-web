'use client'

import { BookDetail } from '@/lib/types/book'
// import { useRouter } from 'next/router'
import { BookForm, BookFormValues } from './BookForm'

export const BookEditForm: React.FC<{ book: BookDetail; token: string }> = ({
  book,
}) => {
  const initialData = {
    title: book.title,
    author: book.author,
    year: book.year,
    code: book.code,
    library_id: book.library_id,
  }
  //   const router = useRouter()

  function onSubmit(data: BookFormValues) {
    console.log(data)
    // updateBook(book.id, data, {
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // })
    //     .then(console.log)
    //     .then(() => {
    //         toast({
    //             title: 'Book Updated',
    //         })
    //         router.push(`/books/${book.id}`)
    //     })
    //     .catch((e) => {
    //         toast({
    //             title: 'Error',
    //             description: e?.error,
    //             variant: 'destructive',
    //         })
    //     })
  }

  return <BookForm initialData={initialData} onSubmit={onSubmit} />
}
