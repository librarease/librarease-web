'use client'

import { Book } from '@/lib/types/book'
import {
  useEffect,
  useState,
  useTransition,
  ViewTransition,
  useMemo,
  useCallback,
} from 'react'
import { Card, CardContent } from '../ui/card'
import { Checkbox } from '../ui/checkbox'
import { Field, FieldGroup, FieldLabel } from '../ui/field'
import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { Download, QrCode } from 'lucide-react'
import { toast } from 'sonner'
import { downloadCSV } from '@/lib/book-utils'
import { useRouter } from 'next/navigation'
import { SelectedBook, UnselectedBook } from './book-select-card'

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
  const router = useRouter()

  // Store full book objects instead of just IDs
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [selectedAll, setSelectedAll] = useState<boolean>(false)

  const selectedBookIDs = useMemo(
    () => new Set(selectedBooks.map((b) => b.id)),
    [selectedBooks]
  )

  const toggleSelectAll = useCallback(() => {
    startTransition(() => {
      setSelectedAll((prev) => {
        if (prev) {
          setSelectedBooks([])
          return false
        }
        setSelectedBooks([...books])
        return true
      })
    })
  }, [books])

  useEffect(() => {
    if (selectedAll) {
      setSelectedBooks([...books])
    }
  }, [books, selectedAll])

  // Update toggle to accept book object
  const toggleBookSelectionWithBook = useCallback((book: Book) => {
    startTransition(() =>
      setSelectedBooks((prev) => {
        const exists = prev.find((b) => b.id === book.id)
        if (exists) {
          return prev.filter((b) => b.id !== book.id)
        } else {
          return [...prev, book]
        }
      })
    )
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
      if (isPageSelected) {
        // Remove all current page books
        setSelectedBooks((prev) =>
          prev.filter((b) => !books.find((book) => book.id === b.id))
        )
      } else {
        // Add all current page books
        setSelectedBooks((prev) => {
          const prevIds = new Set(prev.map((b) => b.id))
          const newBooks = books.filter((b) => !prevIds.has(b.id))
          return [...prev, ...newBooks]
        })
      }
    })
  }, [isPageSelected, books])

  // Memoize the filtered books list
  const unselectedBooks = useMemo(
    () => books.filter((book) => !selectedBookIDs.has(book.id)),
    [books, selectedBookIDs]
  )

  const atLeastOneSelected = selectedBooks.length > 0 || selectedAll

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
          Download Template ({selectedAll ? 'All' : selectedBooks.length})
        </Button>
        <Button
          variant="outline"
          disabled={!atLeastOneSelected}
          onClick={onPrint}
        >
          <QrCode className="mr-2 h-4 w-4" />
          Print QR Codes ({selectedAll ? 'All' : selectedBooks.length})
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
            <SelectedBook
              key={b.id}
              book={b}
              onDeselect={() => toggleBookSelectionWithBook(b)}
              disabled={selectedAll}
            />
          ))}
        </div>
      )}

      <ViewTransition name="book-select-panel">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {unselectedBooks.map((book) => (
            <UnselectedBook
              key={book.id}
              book={book}
              onSelect={() => toggleBookSelectionWithBook(book)}
              disabled={selectedAll}
            />
          ))}
        </div>
      </ViewTransition>
    </>
  )
}
