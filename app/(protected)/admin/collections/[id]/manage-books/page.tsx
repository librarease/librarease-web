import { FormManageCollectionBooks } from '@/components/collections/FormManageCollectionBooks'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card } from '@/components/ui/card'
import { updateCollectionBooksAction } from '@/lib/actions/collection'
import { getCollection, getListCollectionBooks } from '@/lib/api/collection'
import { Book } from 'lucide-react'

export default async function CollectionManageBooksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //   const claims = await IsLoggedIn()

  const { id } = await params

  const [collectionRes, bookRes] = await Promise.all([
    getCollection(id, { include_book_ids: 'true' }),
    getListCollectionBooks(id, {
      include_book: 'true',
    }),
  ])

  if ('error' in collectionRes) {
    console.log({ libRes: collectionRes })
    return <div>{JSON.stringify(collectionRes.message)}</div>
  }

  if ('error' in bookRes) {
    console.log({ bookRes })
    return <div>{JSON.stringify(bookRes.message)}</div>
  }

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

      {/* Books in Collection */}
      <div className="lg:col-span-3">
        <FormManageCollectionBooks
          initialBooks={bookRes.data.map((b) => b.book!)}
          libraryID={collectionRes.data.library_id}
          initialBookIDs={collectionRes.data.book_ids}
          onSubmitAction={updateCollectionBooksAction.bind(null, id)}
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
    </div>
  )
}
