'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { BookForm, BookFormValues } from './BookForm'
import { createBook } from '@/lib/api/book'
import { toast } from '../hooks/use-toast'

const initialData: BookFormValues = {
  title: '',
  author: '',
  year: 0,
  code: '',
  library_id: '',
}

export const BookCreateForm: React.FC = () => {
  const router = useRouter()

  function onSubmit(data: BookFormValues) {
    createBook(data)
      .then(console.log)
      .then(() => {
        toast({
          title: 'Book Registered',
        })
        router.push('/books')
      })
      .catch((e) => {
        toast({
          title: 'Error',
          description: e?.error,
          variant: 'destructive',
        })
      })
  }

  return <BookForm initialData={initialData} onSubmit={onSubmit} />
}
