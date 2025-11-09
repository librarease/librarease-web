'use client'

import { Book } from '@/lib/types/book'
import { useState, useMemo, startTransition } from 'react'
import { toast } from 'sonner'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'
import { SelectedBook, UnselectedBook } from '../books/book-select-card'

export const FormManageCollectionBooks: React.FC<{
  initialBooks: Book[]
  initialBookIDs: string[]
  onSubmitAction: (v: string[]) => Promise<string>
  books: Book[]
}> = ({ initialBooks, initialBookIDs, onSubmitAction, books }) => {
  const [selectedBooks, setSelectedBooks] = useState<Map<string, Book>>(
    new Map(initialBooks.map((book) => [book.id, book]))
  )

  const selectedBooksArray = useMemo(
    () => Array.from(selectedBooks.values()),
    [selectedBooks]
  )

  const unselectedBooks = useMemo(
    () => books.filter((book) => !selectedBooks.has(book.id)),
    [books, selectedBooks]
  )

  const toggleBookSelection = (book: Book) => {
    startTransition(() =>
      setSelectedBooks((prev) => {
        const next = new Map(prev)
        if (next.has(book.id)) {
          next.delete(book.id)
        } else {
          next.set(book.id, book)
        }
        return next
      })
    )
  }

  const selectedBookIDsArray = selectedBooksArray.map((book) => book.id)
  const hasSameNumber = initialBookIDs.length === selectedBookIDsArray.length
  const hasEveryBook = initialBookIDs.every((id) =>
    selectedBookIDsArray.includes(id)
  )
  const isNoChange = hasSameNumber && hasEveryBook

  const onSubmit = async () => {
    const result = await onSubmitAction(selectedBookIDsArray)
    toast(result)
  }

  const deselectAll = () => {
    setSelectedBooks(new Map())
  }

  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-col justify-end md:flex-row top-[4.25rem] md:top-4 sticky z-10 gap-4">
        <Button
          variant="outline"
          onClick={deselectAll}
          disabled={selectedBooks.size === 0}
          className="h-full"
        >
          <X className="mr-2 h-4 w-4" />
          Deselect All ({selectedBooks.size})
        </Button>
        <Button onClick={onSubmit} className="h-full" disabled={isNoChange}>
          <Plus className="mr-2 h-4 w-4" />
          Save Selection ({selectedBooks.size})
        </Button>
      </div>

      {selectedBooksArray.length > 0 && (
        <div className="flex items-end overflow-x-scroll p-6 isolate">
          {selectedBooksArray.map((b) => (
            <SelectedBook
              key={b.id}
              book={b}
              onDeselect={toggleBookSelection}
            />
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {unselectedBooks.map((book) => (
          <UnselectedBook
            key={book.id}
            book={book}
            onSelect={toggleBookSelection}
          />
        ))}
      </div>
    </div>
  )
}
