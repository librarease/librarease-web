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
import { REDIS_KEY_BOOK_PRINT_PREFIX, SITE_NAME } from '@/lib/consts'
import { Badge } from '@/components/ui/badge'
import { cookies } from 'next/headers'
import { Verify } from '@/lib/firebase/firebase'
import { BookSelectPanel } from '@/components/books/book-select-panel'
import { SearchInput } from '@/components/common/SearchInput'
import { cache } from '@/lib/redis-helpers'
import { getBookImportTemplate } from '@/lib/book-utils'

async function onPrintAction(
  bookIDs: string[]
): Promise<{ key: string } | { error: string }> {
  'use server'

  // hash the key
  const hash = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(bookIDs.toSorted().join(','))
  )
  const key = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16) // Shorten to 16 characters

  const success = await cache.set(
    `${REDIS_KEY_BOOK_PRINT_PREFIX}:${key}`,
    bookIDs,
    300
  )
  if (!success) {
    return {
      error: 'Failed to store print data in cache',
    }
  }
  return { key }
}

async function downloadImportTemplateAction(
  bookIDs: string[]
): Promise<{ csv: string } | { error: string }> {
  'use server'

  if (!bookIDs) {
    return { error: 'No book IDs provided' }
  }

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  const res = await getListBooks(
    bookIDs ? { ids: bookIDs, library_id: libID } : { library_id: libID }
  )
  if ('error' in res) {
    return { error: res.error }
  }

  const csv = getBookImportTemplate(res.data)
  if (!csv) {
    return {
      error: 'Failed to generate CSV',
    }
  }
  return { csv }
}

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
      </div>

      <BookSelectPanel
        books={res.data}
        onPrintAction={onPrintAction}
        downloadImportTemplateAction={downloadImportTemplateAction}
      />

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
