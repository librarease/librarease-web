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
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { Badge } from '@/components/ui/badge'
import { ListBook } from '@/components/books/ListBook'
import { Verify } from '@/lib/firebase/firebase'
import { getListWatchlist } from '@/lib/api/watchlist'
import { SearchInput } from '@/components/common/SearchInput'

export const metadata: Metadata = {
  title: `Watchlist Books · ${SITE_NAME}`,
}

export default async function UserBooks({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    library_id?: string
    title?: string
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const library_id = sp?.library_id

  const query = {
    sort_by: 'created_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    title: sp?.title,
    include_stats: 'true',
    ...(library_id ? { library_id } : {}),
  } as const

  const headers = await Verify({ from: '/books/watchlist' })

  const res = await getListWatchlist(query, { headers })

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL =
    `/books/watchlist?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/books/watchlist?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Books</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
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
        </div>
      </nav>

      <div className="flex justify-between gap-4">
        <SearchInput
          className="max-w-md"
          placeholder="Search by title"
          name="title"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {res.data.map((book) => (
          <Link key={book.id} href={`/books/${book.id}`} passHref>
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
