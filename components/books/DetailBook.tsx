import { Calendar, Hash, Library } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThreeDBook } from '@/components/books/three-d-book'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { BookDetail } from '@/lib/types/book'
import { ViewTransition } from 'react'
import { getBookStatus } from '@/lib/utils'

export const DetailBook: React.FC<
  React.PropsWithChildren<{ book: BookDetail }>
> = ({ book, children }) => {
  const status = getBookStatus(book.stats)
  const isAvailable = status === 'available'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Book Cover */}
      <div className="lg:col-span-1 grid place-items-center gap-4">
        <ViewTransition name={book.id}>
          <ThreeDBook book={book} />
        </ViewTransition>
        {children}
      </div>

      {/* Book Information */}
      <div className="lg:col-span-2 space-y-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{book.author}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              className="uppercase"
              variant={isAvailable ? 'default' : 'secondary'}
            >
              {status}
            </Badge>
            <Badge variant="outline">book.genre</Badge>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Book Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 grid-cols-[max-content_1fr] md:grid-cols-[max-content_1fr_max-content_1fr] items-center">
            <Hash className="size-4" />
            <p>
              <span className="font-medium">Code:&nbsp;</span>
              {book.code}
            </p>
            <Calendar className="size-4" />
            <p>
              <span className="font-medium">Year:&nbsp;</span>
              {book.year}
            </p>
            <Library className="size-4" />
            <p>
              <span className="font-medium">Library:&nbsp;</span>
              <Link href={`/libraries/${book.library.id}`}>
                {book.library.name}
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">book.description</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
