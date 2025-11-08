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
import { Button } from '../ui/button'
import { Download, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { downloadCSV } from '@/lib/book-utils'
import { useRouter } from 'next/navigation'

export const BookSelectPanel: React.FC<{
  books: Book[]
  onPrintAction: (
    bookIDs: string[]
  ) => Promise<{ key: string } | { error: string }>
  downloadImportTemplateAction: (
    bookIDs: string[]
  ) => Promise<{ csv: string } | { error: string }>
}> = ({ books, onPrintAction, downloadImportTemplateAction }) => {
  const [, startTransition] = useTransition()

  // Create a stable Map reference for book lookups
  const booksMap = useMemo(() => new Map(books.map((b) => [b.id, b])), [books])

  // Only store IDs, not full book objects
  const [selectedBookIDs, setSelectedBookIDs] = useState<Set<string>>(new Set())
  const [selectedAll, setSelectedAll] = useState<boolean>(false)

  const toggleSelectAll = useCallback(() => {
    startTransition(() => {
      setSelectedAll((prev) => {
        if (prev) {
          setSelectedBookIDs(new Set())
          return false
        }
        setSelectedBookIDs(new Set(books.map((b) => b.id)))
        return true
      })
    })
  }, [books])

  useEffect(() => {
    if (selectedAll) {
      setSelectedBookIDs(new Set(books.map((b) => b.id)))
    }
  }, [books, selectedAll])

  const toggleBookSelection = useCallback((bookId: string) => {
    // startTransition(() => {
    setSelectedBookIDs((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) {
        next.delete(bookId)
      } else {
        next.add(bookId)
      }
      return next
      // })
    })
  }, [])

  // Memoize the page selection state
  const isPageSelected = useMemo(
    () =>
      selectedAll ||
      (books.length > 0 && books.every((b) => selectedBookIDs.has(b.id))),
    [selectedAll, books, selectedBookIDs]
  )

  const toggleSelectPage = useCallback(() => {
    startTransition(() => {
      setSelectedBookIDs((prev) => {
        const next = new Set(prev)
        if (isPageSelected) {
          // Remove all current page book IDs
          books.forEach((b) => next.delete(b.id))
        } else {
          // Add all current page book IDs
          books.forEach((b) => next.add(b.id))
        }
        return next
      })
    })
  }, [isPageSelected, books])

  // Memoize the filtered books list
  const unselectedBooks = useMemo(
    () => books.filter((book) => !selectedBookIDs.has(book.id)),
    [books, selectedBookIDs]
  )

  // Memoize selected books for display
  const selectedBooks = useMemo(
    () =>
      Array.from(selectedBookIDs)
        .map((id) => booksMap.get(id))
        .filter(Boolean) as Book[],
    [selectedBookIDs, booksMap]
  )

  const atLeastOneSelected = selectedBookIDs.size > 0 || selectedAll

  async function onPrint() {
    const res = await onPrintAction(
      selectedAll ? [] : Array.from(selectedBookIDs)
    )
    if ('error' in res) {
      toast.error(`Print QR Code Error: ${res.error}`)
      return
    }
    const printWindow = window.open(
      `/admin/books/print-qr/${res.key}`,
      'PrintQRCodes',
      'width=800,height=600,scrollbars=yes,resizable=yes'
    )
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print()
        // Close popup after print dialog is closed
        printWindow.addEventListener('afterprint', () => {
          printWindow.close()
        })
      })
    }
  }

  const router = useRouter()

  async function onDownloadTemplate() {
    const res = await downloadImportTemplateAction(
      selectedAll ? [] : Array.from(selectedBookIDs)
    )
    if ('error' in res) {
      toast.error(`Download Template Error: ${res.error}`)
      return
    }
    downloadCSV(res.csv)
    toast.success('Template downloaded successfully!', {
      action: {
        label: 'Go to Import',
        onClick: () => router.push('/admin/books/import'),
      },
    })
  }

  return (
    <>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          disabled={!atLeastOneSelected}
          onClick={onDownloadTemplate}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Template ({selectedAll ? 'All' : selectedBookIDs.size})
        </Button>
        <Button
          variant="outline"
          disabled={!atLeastOneSelected}
          onClick={onPrint}
        >
          <QrCode className="mr-2 h-4 w-4" />
          Print QR Codes ({selectedAll ? 'All' : selectedBookIDs.size})
        </Button>
      </div>
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
              onClick={() => (selectedAll ? null : toggleBookSelection(b.id))}
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
              onToggle={() => toggleBookSelection(book.id)}
              disabled={selectedAll}
            />
          ))}
        </div>
      </ViewTransition>
    </>
  )
}

interface BookSelectCardProps {
  book: Book
  onToggle: () => void
  disabled?: boolean
}

// Memoize the card component to prevent unnecessary re-renders
const BookSelectCard = memo<BookSelectCardProps>(
  ({ book, onToggle, disabled = false }) => {
    return (
      <ViewTransition name={`card-${book.id}`}>
        <Card
          className={clsx(
            'cursor-pointer transition-all duration-200 hover:shadow-md',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onClick={disabled ? undefined : onToggle}
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
            <CardTitle className="text-base line-clamp-2">
              {book.title}
            </CardTitle>
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
  }
)

BookSelectCard.displayName = 'BookSelectCard'
