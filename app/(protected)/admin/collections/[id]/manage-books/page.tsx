import { FormManageCollectionBooks } from '@/components/collections/FormManageCollectionBooks'
import { SearchInput } from '@/components/common/SearchInput'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { updateCollectionBooksAction } from '@/lib/actions/collection'
import { getListBooks } from '@/lib/api/book'
import { getCollection, getListCollectionBooks } from '@/lib/api/collection'
import { Book } from 'lucide-react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Route } from 'next'

export default async function CollectionManageBooksPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ skip?: number; limit?: number; title?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)

  const [collectionRes, colBookRes] = await Promise.all([
    getCollection(id, { include_book_ids: 'true' }),
    getListCollectionBooks(id, {
      include_book: 'true',
    }),
  ])

  if ('error' in collectionRes) {
    console.log({ libRes: collectionRes })
    return <div>{JSON.stringify(collectionRes.message)}</div>
  }

  if ('error' in colBookRes) {
    console.log({ bookRes: colBookRes })
    return <div>{JSON.stringify(colBookRes.message)}</div>
  }

  const bookRes = await getListBooks({
    sort_by: 'created_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    title: sp?.title,
    library_id: collectionRes.data.library_id,
  })

  if ('error' in bookRes) {
    console.log(bookRes)
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL =
    `/admin/collections/${id}/manage-books?skip=${skip + limit}&limit=${limit}` as Route
  const prevURL =
    `/admin/collections/${id}/manage-books?skip=${prevSkip}&limit=${limit}` as Route

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{collectionRes.data.title}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/collections">
              Collections
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            {/* @ts-expect-error: typegen does not work */}
            <BreadcrumbLink href={`/admin/collections/${id}`}>
              {collectionRes.data.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <SearchInput
        className="max-w-md sticky top-4"
        placeholder="Search by title"
        name="title"
      />

      {/* Books in Collection */}
      <div className="lg:col-span-3">
        <FormManageCollectionBooks
          initialBooks={colBookRes.data.map((b) => b.book!)}
          initialBookIDs={collectionRes.data.book_ids}
          onSubmitAction={updateCollectionBooksAction.bind(null, id)}
          books={bookRes.data}
        />
      </div>

      {collectionRes.data.book_count === 0 && (
        <Card className="p-12 text-center">
          <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">
            No books in this collection yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Start building your collection by adding some books.
          </p>
        </Card>
      )}
      <Pagination>
        <PaginationContent>
          {bookRes.meta.skip > 0 && (
            <PaginationItem>
              <PaginationPrevious href={prevURL} />
            </PaginationItem>
          )}
          {bookRes.meta.limit <= bookRes.data.length && (
            <PaginationItem>
              <PaginationNext href={nextURL} />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  )
}
