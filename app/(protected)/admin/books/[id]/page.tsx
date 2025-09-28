import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getBook } from '@/lib/api/book'
import { BookDown, Calendar, Hash, Library, Pen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThreeDBook } from '@/components/books/three-d-book'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
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

      <DetailBook book={bookRes.data}>
        <Button className="w-full" asChild>
          <Link href={`/admin/books/${bookRes.data.id}/edit`}>
            <Pen />
            Edit
          </Link>
        </Button>
      </DetailBook>
    </div>
  )
}
