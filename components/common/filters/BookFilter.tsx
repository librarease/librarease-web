'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Command,
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
import { getListBooks } from '@/lib/api/book'
import { toast } from 'sonner'
import { Book } from '@/lib/types/book'
import { useFilterContext } from '../ModelFilter'

export const BookFilter: React.FC<{ filterKey?: string }> = ({
  filterKey = 'book_id',
}) => {
  const { filters, setFilter } = useFilterContext()
  const [query, setQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])

  useEffect(() => {
    getListBooks({
      limit: 20,
      title: query,
    }).then((res) => {
      if ('error' in res) {
        toast.error(res.message)
        return
      }
      setBooks(res.data)
    })
  }, [query])

  const selectedBookID = filters[filterKey]
  const selectedBook = books.find((book) => book.id === selectedBookID)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'w-full justify-between',
            !selectedBookID && 'text-muted-foreground'
          )}
        >
          {selectedBook ? selectedBook.title : 'Filter by book'}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            onValueChange={setQuery}
            value={query}
            placeholder="Search book title..."
          />
          <CommandList>
            <CommandGroup forceMount>
              {books.map((book) => (
                <CommandItem
                  value={book.id}
                  key={book.id}
                  onSelect={() => {
                    setFilter(filterKey, book.id)
                  }}
                >
                  {book.title}
                  <Check
                    className={cn(
                      'ml-auto',
                      book.id === selectedBookID ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
