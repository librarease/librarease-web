import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getListBooks } from '@/lib/api/book'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { Badge } from '@/components/ui/badge'
import { cookies } from 'next/headers'
import { Verify } from '@/lib/firebase/firebase'
import { BookSelectPanel } from '@/components/books/book-select-panel'
import { SearchInput } from '@/components/common/SearchInput'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { QrCode } from 'lucide-react'

export const metadata: Metadata = {
  title: `Books · ${SITE_NAME}`,
}

export default async function BooksSelectPage({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    title?: string
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)

  await Verify({ from: '/admin/books/manage' })

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  const res = await getListBooks({
    sort_by: 'created_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    title: sp?.title,
    library_id: libID,
  })

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL =
    `/admin/books/manage?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/admin/books/manage?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Select Books</h1>
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
              <BreadcrumbPage>
                Manage Books{' '}
                <Badge className="ml-4" variant="outline">
                  {res.meta.total}
                </Badge>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </nav>

      <div className="flex justify-between gap-4">
        <SearchInput
          className="max-w-md"
          placeholder="Search by title"
          name="title"
        />
        <Button variant="outline" asChild>
          <Link href="/admin/books/print-qr">
            <QrCode className="mr-2 h-4 w-4" />
            Print QR Codes
          </Link>
        </Button>
      </div>

      <BookSelectPanel books={res.data} />

      <Pagination>
        <PaginationContent>
          {res.meta.skip > 0 && (
            <PaginationItem>
              <PaginationPrevious href={prevURL} />
            </PaginationItem>
          )}
          {res.meta.limit <= res.data.length && (
            <PaginationItem>
              <PaginationNext href={nextURL} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
