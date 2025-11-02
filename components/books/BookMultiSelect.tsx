'use client'

import { useState, useEffect, useCallback } from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { getListBooks } from '@/lib/api/book'
import { Book } from '@/lib/types/book'

interface BookMultiSelectProps {
  libraryId?: string
  selectedIds: string[]
  onSelectionChange: (ids: string[]) => void
}

export const BookMultiSelect: React.FC<BookMultiSelectProps> = ({
  libraryId,
  selectedIds,
  onSelectionChange,
}) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBooks, setSelectedBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch books based on search query
  const fetchBooks = useCallback(
    async (query: string) => {
      if (!libraryId) return

      setLoading(true)
      try {
        const res = await getListBooks({
          library_id: libraryId,
          title: query,
          limit: 50,
        })

        if ('data' in res) {
          setBooks(res.data)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    },
    [libraryId]
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBooks(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, fetchBooks])

  // Fetch selected books details
  useEffect(() => {
    const fetchSelectedBooks = async () => {
      if (selectedIds.length === 0 || !libraryId) {
        setSelectedBooks([])
        return
      }

      try {
        const res = await getListBooks({
          library_id: libraryId,
          id: selectedIds.join(','),
          limit: selectedIds.length,
        })

        if ('data' in res) {
          setSelectedBooks(res.data)
        }
      } catch (error) {
        console.error('Error fetching selected books:', error)
      }
    }

    fetchSelectedBooks()
  }, [selectedIds, libraryId])

  const toggleBook = (bookId: string) => {
    const newSelectedIds = selectedIds.includes(bookId)
      ? selectedIds.filter((id) => id !== bookId)
      : [...selectedIds, bookId]

    onSelectionChange(newSelectedIds)
  }

  const removeBook = (bookId: string) => {
    onSelectionChange(selectedIds.filter((id) => id !== bookId))
  }

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedIds.length > 0
                ? `${selectedIds.length} selected`
                : 'Search and select books...'}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search books by title..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {loading ? 'Searching...' : 'No books found'}
              </CommandEmpty>
              <CommandGroup>
                {books.map((book) => (
                  <CommandItem
                    key={book.id}
                    value={book.id}
                    onSelect={() => toggleBook(book.id)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedIds.includes(book.id)
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <div className="flex-1 truncate">
                      <div className="font-medium truncate">{book.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {book.author} • {book.code}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected books badges */}
      {selectedBooks.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedBooks.map((book) => (
            <Badge
              key={book.id}
              variant="secondary"
              className="text-xs gap-1 pr-1"
            >
              <span className="truncate max-w-[200px]">{book.title}</span>
              <button
                type="button"
                onClick={() => removeBook(book.id)}
                className="ml-1 rounded-full hover:bg-muted p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
