import { Calendar, Hash, Library } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBook } from '@/lib/api/book'
import { getBookStatus } from '@/lib/utils'
import Link from 'next/link'

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [bookRes] = await Promise.all([getBook({ id })])

  if ('error' in bookRes) {
    console.log({ libRes: bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  const status = getBookStatus(bookRes.data.stats)
  const isAvailable = status === 'available'

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">{bookRes.data.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {bookRes.data.author}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge
            className="uppercase"
            variant={isAvailable ? 'default' : 'secondary'}
          >
            {status}
          </Badge>
          {/* <Badge variant="outline">bookRes.data.genre</Badge> */}
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
            <Link
              href={`/libraries/${bookRes.data.library.id}`}
              className="link"
            >
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
          <p className="text-sm leading-relaxed">{bookRes.data.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
