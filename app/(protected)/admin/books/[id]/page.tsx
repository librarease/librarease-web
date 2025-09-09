import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBook } from '@/lib/api/book'
import { BookDown, Calendar, Hash, Library } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThreeDBook } from '@/components/books/three-d-book'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

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
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{bookRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Book Cover */}
        <div className="lg:col-span-1 grid place-items-center gap-4">
          <ThreeDBook book={bookRes.data} />
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
        </div>

        {/* Book Information */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{bookRes.data.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">
              {bookRes.data.author}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={
                  bookRes.data.stats?.is_available ? 'default' : 'secondary'
                }
              >
                {bookRes.data.stats?.is_available ? 'Available' : 'Borrowed'}
              </Badge>
              <Badge variant="outline">bookRes.data.genre</Badge>
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
                {bookRes.data.code}
              </p>
              <Calendar className="size-4" />
              <p>
                <span className="font-medium">Year:&nbsp;</span>
                {bookRes.data.year}
              </p>
              <Library className="size-4" />
              <p>
                <span className="font-medium">Library:&nbsp;</span>
                <Link href={`/libraries/${bookRes.data.library.id}`}>
                  {bookRes.data.library.name}
                </Link>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                bookRes.data.description
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* <div className="place-self-center text-center pt-4 border-t">
        <p className="text-gray-600">{bookRes.data.author}</p>
        <p className="text-sm text-gray-500">{bookRes.data.code}</p>
      </div> */}
    </div>
  )
}
