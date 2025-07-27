import { Book } from '@/lib/types/book'
import Image from 'next/image'
import { Calendar, Hash } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import clsx from 'clsx'

export const ListBook: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="grid place-items-center">
          {/* 3D Book Effect */}
          <div className="flex my-12">
            <div className="bg-accent [transform:perspective(400px)_rotateY(314deg)] -mr-1 w-4">
              <span className="inline-block text-nowrap text-[0.5rem] font-bold text-accent-foreground/50 [transform:rotate(90deg)_translateY(-16px)] origin-top-left">
                {/* {book.title.length > 15
                          ? book.title.substring(0, 25) + '...'
                          : book.title} */}
              </span>
            </div>
            <Image
              src={book?.cover ?? '/book-placeholder.svg'}
              alt={book.title + "'s cover"}
              width={128}
              height={192}
              className={clsx(
                'shadow-xl rounded-r-md w-32 h-48 object-cover',
                '[transform:perspective(800px)_rotateY(14deg)]'
              )}
              priority
            />
          </div>
          {/* <div className="bg-accent [transform:perspective(400px)_rotateY(314deg)] -mr-1 w-3 h-48">
                        <span className="my-2 inline-block text-nowrap text-xs font-bold text-accent-foreground/50 [transform:rotate(90deg)_translateY(-20px)] origin-top-left">
                          {book.title.length > 15
                            ? book.title.substring(0, 15) + '...'
                            : book.title}
                        </span>
                      </div>
                      <Image
                        src={
                          book.cover ??
                          '/placeholder.svg?height=192&width=128&text=No+Cover'
                        }
                        alt={`${book.title} cover`}
                        width={128}
                        height={192}
                        className="shadow-xl rounded-r-md w-32 h-48 object-cover [transform:perspective(800px)_rotateY(14deg)] group-hover:[transform:perspective(800px)_rotateY(8deg)] transition-transform duration-300"
                      /> */}
        </div>
        <CardTitle className="text-lg line-clamp-1">{book.title}</CardTitle>
        <CardDescription className="line-clamp-1">
          {book.author}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Hash className="h-3 w-3" />
            <span>{book.code}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>{book.year}</span>
          </div>
          {/* {book.genre && (
                      <Badge variant="outline" className="text-xs">
                        {book.genre}
                      </Badge>
                    )} */}
          {/* <div className="flex justify-between items-center mt-3">
                      <Badge variant={book.available ? "default" : "destructive"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{book.library}</span>
                    </div> */}
        </div>
      </CardContent>
    </Card>
  )
}
