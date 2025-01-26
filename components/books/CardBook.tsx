import { Book } from '@/lib/types/book'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const CardBook: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg line-clamp-2">Book</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <div className="grid grid-cols-3">
            <dt className="font-medium">Title:</dt>
            <dd className="col-span-2">{book.title}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Author:</dt>
            <dd className="col-span-2">{book.author}</dd>
          </div>
          <div className="grid grid-cols-3">
            <dt className="font-medium">Code:</dt>
            <dd className="col-span-2">{book.code}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}
