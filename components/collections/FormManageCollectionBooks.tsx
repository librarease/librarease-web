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
  const [selectedBookIDs, setSelectedBookIDs] = useState<Set<string>>(
    new Set(initialBookIDs)
  )

  // Combine initial books with fetched books, avoiding duplicates
  const allBooks = useMemo(() => {
    const initialBookIds = new Set(initialBooks.map((b) => b.id))
    const uniqueFetchedBooks = books.filter(
      (book) => !initialBookIds.has(book.id)
    )
    return initialBooks.concat(uniqueFetchedBooks)
  }, [initialBooks, books])

  const selectedBooks = useMemo(
    () => allBooks.filter((book) => selectedBookIDs.has(book.id)),
    [allBooks, selectedBookIDs]
  )

  const unselectedBooks = useMemo(
    () => allBooks.filter((book) => !selectedBookIDs.has(book.id)),
    [allBooks, selectedBookIDs]
  )

  const toggleBookSelection = (bookId: string) => {
    startTransition(() =>
      setSelectedBookIDs((prev) => {
        const next = new Set(prev)
        if (next.has(bookId)) {
          next.delete(bookId)
        } else {
          next.add(bookId)
        }
        return next
      })
    )
  }

  const selectedBookIDsArray = Array.from(selectedBookIDs)
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
    setSelectedBookIDs(new Set())
  }

  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-col justify-end md:flex-row top-[4.25rem] md:top-4 sticky z-10 gap-4">
        <Button
          variant="outline"
          onClick={deselectAll}
          disabled={selectedBookIDs.size === 0}
          className="h-full"
        >
          <X className="mr-2 h-4 w-4" />
          Deselect All ({selectedBookIDs.size})
        </Button>
        <Button onClick={onSubmit} className="h-full" disabled={isNoChange}>
          <Plus className="mr-2 h-4 w-4" />
          Save Selection ({selectedBookIDs.size})
        </Button>
      </div>

      {selectedBooks.length > 0 && (
        <div className="flex items-end overflow-x-scroll p-6 isolate">
          {selectedBooks.map((b) => (
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
