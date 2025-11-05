'use client'

import { Book } from '@/lib/types/book'
import {
  useEffect,
  useState,
  useRef,
  ViewTransition,
  useTransition,
} from 'react'
import { getListBooks } from '@/lib/api/book'
import { toast } from 'sonner'
import { Input } from '../ui/input'
import { Plus, X } from 'lucide-react'
import { Button } from '../ui/button'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { Check } from 'lucide-react'

export const FormManageCollectionBooks: React.FC<{
  initialBooks: Book[]
  libraryID: string
  initialBookIDs: string[]
  onSubmitAction: (v: string[]) => Promise<string>
}> = ({ initialBooks, libraryID, initialBookIDs, onSubmitAction }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [, startTransition] = useTransition()
  const [selectedBooks, _setSelectedBooks] = useState<Book[]>(initialBooks)
  const selectedBookIDs = selectedBooks.map((b) => b.id)

  function setSelectedBooks(books: Parameters<typeof _setSelectedBooks>[0]) {
    startTransition(() => {
      _setSelectedBooks(books)
    })
  }

  const [bookQ, setBookQ] = useState<
    Pick<Parameters<typeof getListBooks>[0], 'title' | 'library_id'>
  >({
    title: '',
    library_id: libraryID,
  })

  // Debounced fetch
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      getListBooks({
        limit: 20,
        ...bookQ,
      }).then((res) => {
        if ('error' in res) {
          toast(res.message)
          return
        }
        setBooks(res.data)
      })
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [bookQ])

  const toggleBookSelection = (book: Book) => {
    setSelectedBooks((prev) =>
      prev.find((b) => b.id === book.id)
        ? prev.filter((b) => b.id !== book.id)
        : [...prev, book]
    )
  }

  const hasSameNumber = initialBookIDs.length === selectedBookIDs.length
  const hasEveryBook = initialBookIDs.every((id) =>
    selectedBookIDs.includes(id)
  )
  const isNoChange = hasSameNumber && hasEveryBook

  const onSubmit = async () => {
    const result = await onSubmitAction(selectedBookIDs)
    toast(result)
  }

  return (
    <div className="mx-auto space-y-4">
      <div className="flex flex-col md:flex-row top-4 sticky z-10 gap-4">
        <Input
          type="text"
          className="bg-background/20 backdrop-blur-md"
          value={bookQ.title}
          onChange={(e) =>
            setBookQ((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Search book title..."
        />
        <div className="flex gap-4 mx-auto">
          <Button
            variant="outline"
            onClick={() => setSelectedBooks([])}
            disabled={selectedBooks.length === 0}
            className="h-full"
          >
            <X className="mr-2 h-4 w-4" />
            Deselect All ({selectedBooks.length})
          </Button>
          <Button onClick={onSubmit} className="h-full" disabled={isNoChange}>
            <Plus className="mr-2 h-4 w-4" />
            Save Selection ({selectedBooks.length})
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {selectedBooks
          .concat(books.filter((book) => !selectedBookIDs.includes(book.id)))
          .map((book) => (
            <ViewTransition name={book.id} key={book.id}>
              <BookSelectCard
                book={book}
                isSelected={selectedBookIDs.includes(book.id)}
                onToggle={toggleBookSelection}
              />
            </ViewTransition>
          ))}
      </div>
    </div>
  )
}

interface BookSelectCardProps {
  book: Book
  isSelected: boolean
  onToggle: (book: Book) => void
  ImageWrapper?: React.FC<React.PropsWithChildren>
}

const BookSelectCard: React.FC<BookSelectCardProps> = ({
  book,
  isSelected,
  onToggle,
}) => {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected ? 'ring-1 ring-primary bg-primary/5' : ''
      }`}
      onClick={() => onToggle(book)}
    >
      <CardHeader className="pb-3">
        <div className="relative mx-auto mb-4 flex justify-center">
          <Image
            src={book.cover ?? '/book-placeholder.svg'}
            alt={`${book.title} cover`}
            width={100}
            height={150}
          />
          {isSelected && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
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
  )
}
