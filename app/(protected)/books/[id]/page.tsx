import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBook } from '@/lib/api/book'
import { BookDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DetailBook } from '@/components/books/DetailBook'

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [bookRes] = await Promise.all([getBook({ id, include_stats: 'true' })])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{bookRes.data.title}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{bookRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <DetailBook book={bookRes.data}>
        <Button className="w-full" disabled={true}>
          {true ? (
            <>
              <BookDown className="mr-2 h-4 w-4" />
              Borrow Book
            </>
          ) : (
            'Currently Borrowed'
          )}
        </Button>
        <Button variant="outline" className="w-full bg-transparent">
          Add to Wishlist
        </Button>
      </DetailBook>

      {/* <div className="place-self-center text-center pt-4 border-t">
        <p className="text-gray-600">{bookRes.data.author}</p>
        <p className="text-sm text-gray-500">{bookRes.data.code}</p>
      </div> */}
    </div>
  )
}
