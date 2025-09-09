import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { getListBooks } from '@/lib/api/book'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { Search } from 'lucide-react'
import { DebouncedInput } from '@/components/common/DebouncedInput'
import { Badge } from '@/components/ui/badge'
import { ListBook } from '@/components/books/ListBook'
import { cookies } from 'next/headers'
import { Verify } from '@/lib/firebase/firebase'

export const metadata: Metadata = {
  title: `Books · ${SITE_NAME}`,
}

export default async function Books({
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

  await Verify({ from: '/admin/books' })

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
    include_stats: 'true',
  })

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/admin/books?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/admin/books?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Books</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>
                  Books{' '}
                  <Badge className="ml-4" variant="outline">
                    {res.meta.total}
                  </Badge>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild>
            <Link href="/admin/books/new">Register New Book</Link>
          </Button>
        </div>
      </nav>

      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />

        <DebouncedInput
          name="title"
          placeholder="Search by title"
          className="pl-8 max-w-md"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {res.data.map((book) => (
          <Link key={book.id} href={`/admin/books/${book.id}`} passHref>
            <ListBook book={book} />
          </Link>
        ))}
      </div>
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
