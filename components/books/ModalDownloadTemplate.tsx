'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Check, ChevronsUpDown } from 'lucide-react'
import { getListBooks } from '@/lib/api/book'
import { Book } from '@/lib/types/book'
import { toast } from 'sonner'
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
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

interface ModalDownloadTemplateProps {
  libraryId?: string
  children?: React.ReactNode
}

export const ModalDownloadTemplate: React.FC<ModalDownloadTemplateProps> = ({
  libraryId,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [books, setBooks] = useState<Book[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  // Fetch books when modal opens or search query changes
  useEffect(() => {
    if (!open) return

    const timer = setTimeout(async () => {
      if (!libraryId) return

      try {
        const res = await getListBooks({
          library_id: libraryId,
          title: searchQuery,
          limit: 5,
        })
        if ('error' in res) {
          toast.error(res.error || 'Failed to load books')
          setBooks([])
        } else {
          setBooks(res.data)
        }
      } catch (e) {
        console.error(e)
        toast.error('Failed to load books')
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [open, searchQuery, libraryId])

  const toggleBook = (bookId: string) => {
    setSelectedIds((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    )
  }

  const removeBook = (bookId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== bookId))
  }

  const downloadCSV = (books: Array<Partial<Book>>) => {
    const headers = ['id', 'code', 'title', 'author', 'year']
    const rows = books.map((b) => [
      b.id || '',
      b.code || '',
      b.title || '',
      b.author || '',
      (b.year as any) || '',
    ])
    const csvRows = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((f) => `"${String(f).replace(/"/g, '""')}"`).join(',')
      ),
    ]
    const csv = csvRows.join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `books_template_${new Date().toISOString().split('T')[0]}.csv`
    )
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDownloadEmpty = () => {
    // just download csv with headers only
    downloadCSV([])
    toast.success('Template downloaded')
    setOpen(false)
  }

  const handleDownloadSelected = async () => {
    if (selectedIds.length === 0) return
    if (!libraryId) {
      toast.error('No library selected')
      return
    }
    setIsDownloading(true)
    try {
      const res = await getListBooks({
        library_id: libraryId,
        id: selectedIds.join(','),
        limit: selectedIds.length,
      })
      if ('error' in res) {
        throw new Error(res.error || 'Failed to fetch selected books')
      }
      const books = res.data
      downloadCSV(books)
      toast.success('Template downloaded')
      setOpen(false)
      setSelectedIds([])
      setSearchQuery('')
      setBooks([])
    } catch (e) {
      console.error(e)
      toast.error(e instanceof Error ? e.message : 'Failed to download')
    } finally {
      setIsDownloading(false)
    }
  }

  const [comboOpen, setComboOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="link" className="p-0 h-auto">
            <Download className="h-3 w-3 mr-1" />
            Download template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Download CSV Template</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <p className="text-sm">
              You can download an empty template or search & include existing
              books.
            </p>
          </div>

          <div className="grid gap-3">
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboOpen}
                  className="justify-between"
                >
                  {selectedIds.length > 0
                    ? `${selectedIds.length} book(s) selected`
                    : 'Search and select books...'}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search books by title..."
                    value={searchQuery}
                    onValueChange={setSearchQuery}
                  />
                  <CommandList>
                    <CommandGroup>
                      {books.length === 0 && searchQuery && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          No books found
                        </div>
                      )}
                      {books.map((book) => (
                        <CommandItem
                          key={book.id}
                          value={book.id}
                          onSelect={() => {
                            toggleBook(book.id)
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selectedIds.includes(book.id)
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{book.title}</div>
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

            {selectedIds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedIds.map((id) => (
                  <Badge key={id} variant="secondary" className="gap-1">
                    {id}
                    <button
                      type="button"
                      className="ml-1 hover:text-destructive"
                      onClick={() => removeBook(id)}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={
                selectedIds.length === 0
                  ? handleDownloadEmpty
                  : handleDownloadSelected
              }
              disabled={isDownloading}
              variant={selectedIds.length ? 'default' : 'secondary'}
            >
              {isDownloading
                ? 'Downloading...'
                : `Download ${selectedIds.length ? 'Edit' : 'Empty'} Template`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
