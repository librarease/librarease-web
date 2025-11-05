import { Book } from '@/lib/types/book'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'

interface BookSelectCardProps {
  book: Book
  isSelected: boolean
  onToggle: (book: Book) => void
  ImageWrapper?: React.FC<React.PropsWithChildren>
}

export const BookSelectCard: React.FC<BookSelectCardProps> = ({
  book,
  isSelected,
  onToggle,
  ImageWrapper = Fragment,
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
          <ImageWrapper
            children={
              <Image
                src={book.cover ?? '/book-placeholder.svg'}
                alt={`${book.title} cover`}
                width={100}
                height={150}
              />
            }
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
