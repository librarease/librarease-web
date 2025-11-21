'use client'

import { Book } from '@/lib/types/book'
import { memo, ViewTransition } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import Image from 'next/image'
import clsx from 'clsx'

export const SelectedBook = memo<{
  book: Book
  onDeselect?: (book: Book) => void
  disabled?: boolean
}>(({ book, onDeselect, disabled }) => {
  return (
    <div
      onClick={() => (disabled ? null : onDeselect?.(book))}
      className={clsx(
        'shrink-0 relative left-0 transition-all not-first-of-type:-ml-12',
        'hover:transition-all hover:-translate-y-4 hover:transform-none',
        'peer peer-hover:left-12 peer-hover:transition-all',
        'transform-[perspective(800px)_rotateY(20deg)]',
        !disabled && 'hover:cursor-pointer',
        'group'
      )}
    >
      <ViewTransition name={book.id}>
        <div className="relative">
          <Image
            src={book?.cover ?? '/book-placeholder.svg'}
            alt={book.title + "'s cover"}
            width={128}
            height={192}
            className="shadow-md rounded-lg w-32 h-48 place-self-center object-cover"
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col justify-end p-2">
            <p className="text-white text-xs font-semibold line-clamp-2 mb-1">
              {book.title}
            </p>
            <p className="text-white/90 text-xs font-mono">{book.code}</p>
          </div>
        </div>
      </ViewTransition>
    </div>
  )
})

SelectedBook.displayName = 'SelectedBook'

// Memoize the card component to prevent unnecessary re-renders
export const UnselectedBook = memo<{
  book: Book
  onSelect?: (book: Book) => void
  disabled?: boolean
}>(({ book, onSelect, disabled }) => {
  return (
    <ViewTransition name={'card-' + book.id}>
      <Card
        className={clsx(
          'cursor-pointer transition-all duration-200 hover:shadow-md',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={disabled ? undefined : () => onSelect?.(book)}
      >
        <CardHeader className="text-center">
          <ViewTransition name={book.id}>
            <Image
              src={book.cover ?? '/book-placeholder.svg'}
              alt={`${book.title} cover`}
              width={96}
              height={144}
              className="mx-auto w-24 h-[9rem] rounded-lg"
            />
          </ViewTransition>
          <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {book.author}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <span>{book.year}</span>
          <span>•</span>
          <span>{book.code}</span>
        </CardContent>
      </Card>
    </ViewTransition>
  )
})

UnselectedBook.displayName = 'UnselectedBook'

export const BookSelectCard = UnselectedBook
