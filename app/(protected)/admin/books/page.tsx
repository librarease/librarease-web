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
import { Plus, Settings, Upload } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ListBook } from '@/components/books/ListBook'
import { cookies } from 'next/headers'
import { Verify } from '@/lib/firebase/firebase'
import { colorsToCssVars } from '@/lib/utils/color-utils'
import { SearchInput } from '@/components/common/SearchInput'

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

  const res = await getListBooks(
    {
      sort_by: 'created_at',
      sort_in: 'desc',
      limit: limit,
      skip: skip,
      title: sp?.title,
      library_id: libID,
      include_stats: 'true',
    },
    {
      cache: 'force-cache',
      next: {
        tags: ['books'],
        revalidate: 300,
      },
    }
  )

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
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/books/import">
                <Upload className="mr-2 h-4 w-4" />
                Import Books
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/books/manage">
                <Settings className="mr-2 h-4 w-4" />
                Manage Books
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/books/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Book
              </Link>
            </Button>
          </div>
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
          <Link key={book.id} href={`/admin/books/${book.id}`} passHref>
            <ListBook book={book} style={colorsToCssVars(book.colors)} />
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
