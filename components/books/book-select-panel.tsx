'use client'

import { Book } from '@/lib/types/book'
import {
  useEffect,
  useState,
  useTransition,
  ViewTransition,
  useMemo,
  useCallback,
  memo,
} from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Alert, AlertDescription } from '../ui/alert'

export const BookSelectPanel: React.FC<{
  books: Book[]
}> = ({ books }) => {
  const [, startTransition] = useTransition()
  const [selectedBooks, _setSelectedBooks] = useState<Book[]>([])

  // Use Set for O(1) lookups instead of array
  const selectedBookIDsSet = useMemo(
    () => new Set(selectedBooks.map((b) => b.id)),
    [selectedBooks]
  )

  const [selectedAll, _setSelectedAll] = useState<boolean>(false)

  const toggleSelectAll = useCallback(() => {
    startTransition(() => {
      _setSelectedAll((prev) => {
        if (prev) {
          _setSelectedBooks([])
          return false
        }
        _setSelectedBooks(books)
        return true
      })
    })
  }, [books])

  useEffect(() => {
    if (selectedAll) {
      _setSelectedBooks(books)
    }
  }, [books, selectedAll])

  const setSelectedBooks = useCallback(
    (books: Parameters<typeof _setSelectedBooks>[0]) => {
      startTransition(() => {
        _setSelectedBooks(books)
      })
    },
    []
  )

  const toggleBookSelection = useCallback(
    (book: Book) => {
      setSelectedBooks((prev) =>
        prev.find((b) => b.id === book.id)
          ? prev.filter((b) => b.id !== book.id)
          : [...prev, book]
      )
    },
    [setSelectedBooks]
  )

  // Memoize the page selection state
  const isPageSelected = useMemo(
    () =>
      selectedAll ||
      (books.length > 0 && books.every((b) => selectedBookIDsSet.has(b.id))),
    [selectedAll, books, selectedBookIDsSet]
  )

  const toggleSelectPage = useCallback(() => {
    if (isPageSelected) {
      setSelectedBooks((prev) =>
        prev.filter((b) => !books.find((pb) => pb.id === b.id))
      )
      return
    }
    setSelectedBooks((prev) =>
      prev.concat(books.filter((b) => !prev.find((pb) => pb.id === b.id)))
    )
  }, [isPageSelected, books, setSelectedBooks])

  // Memoize the filtered books list
  const unselectedBooks = useMemo(
    () => books.filter((book) => !selectedBookIDsSet.has(book.id)),
    [books, selectedBookIDsSet]
  )

  return (
    <>
      <Card className="has-[&>[data-state=checked]]:border-primary/50 has-[&>[id=select-all-checkbox][data-state=checked]]:bg-primary/10">
        <CardContent>
          <FieldGroup className="grid grid-cols-2">
            <Field orientation="horizontal" aria-disabled={selectedAll}>
              <Checkbox
                checked={isPageSelected}
                onCheckedChange={toggleSelectPage}
                id="select-page-checkbox"
                disabled={selectedAll}
              />
              <FieldLabel htmlFor="select-page-checkbox" className="ml-2">
                {isPageSelected ? 'Deselect Page' : 'Select Page'} (
                {books.length})
              </FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                checked={selectedAll}
                onCheckedChange={toggleSelectAll}
                id="select-all-checkbox"
              />
              <FieldLabel htmlFor="select-all-checkbox" className="ml-2">
                {selectedAll ? 'Deselect All' : 'Select All'}
              </FieldLabel>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
      {selectedAll ? (
        <Alert>
          <AlertDescription>
            You have selected all books in the library.
          </AlertDescription>
        </Alert>
      ) : null}
      {selectedBooks.length > 0 && (
        <div className="flex items-end overflow-x-scroll p-6 isolate">
          {selectedBooks.map((b) => (
            <div
              key={b.id}
              onClick={() => (selectedAll ? null : toggleBookSelection(b))}
              className={clsx(
                'shrink-0 relative left-0 transition-all not-first-of-type:-ml-12',
                'hover:transition-all hover:-translate-y-4 hover:transform-none',
                'peer peer-hover:left-12 peer-hover:transition-all',
                '[transform:perspective(800px)_rotateY(20deg)]',
                'hover:cursor-pointer'
              )}
            >
              <ViewTransition name={b.id}>
                <Image
                  src={b?.cover ?? '/book-placeholder.svg'}
                  alt={b.title + "'s cover"}
                  width={128}
                  height={192}
                  className="shadow-md rounded-lg w-32 h-48 place-self-center object-cover"
                />
              </ViewTransition>
            </div>
          ))}
        </div>
      )}
      <ViewTransition name="book-select-panel">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {unselectedBooks.map((book) => (
            <BookSelectCard
              key={book.id}
              book={book}
              onToggle={selectedAll ? () => {} : toggleBookSelection}
            />
          ))}
        </div>
      </ViewTransition>
    </>
  )
}

interface BookSelectCardProps {
  book: Book
  onToggle: (book: Book) => void
}

// Memoize the card component to prevent unnecessary re-renders
const BookSelectCard = memo<BookSelectCardProps>(({ book, onToggle }) => {
  return (
    <ViewTransition name={`card-${book.id}`}>
      <Card
        className="cursor-pointer transition-all duration-200 hover:shadow-md"
        onClick={() => onToggle(book)}
      >
        <CardHeader className="pb-3">
          <div className="relative mx-auto mb-4 flex justify-center">
            <ViewTransition name={book.id}>
              <Image
                src={book.cover ?? '/book-placeholder.svg'}
                alt={`${book.title} cover`}
                width={100}
                height={150}
                className="z-10"
              />
            </ViewTransition>
          </div>
          <CardTitle className="text-base line-clamp-2">{book.title}</CardTitle>
          <CardDescription className="line-clamp-1">
            {book.author}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{book.year}</span>
              <span>•</span>
              <span>{book.code}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </ViewTransition>
  )
})

BookSelectCard.displayName = 'BookSelectCard'
