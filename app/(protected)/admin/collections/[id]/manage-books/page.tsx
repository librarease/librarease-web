import { ListBook } from '@/components/books/ListBook'
import { BtnDeleteCollection } from '@/components/collections/BtnDeleteCollection'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteCollectionAction } from '@/lib/actions/collection'
import { getCollection, getListCollectionBooks } from '@/lib/api/collection'
import {
  BookOpen,
  Calendar,
  Edit,
  Library,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function CollectionManageBooksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  //   const claims = await IsLoggedIn()

  const { id } = await params

  const [collectionRes, bookRes] = await Promise.all([
    getCollection(id),
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
            <BreadcrumbPage>{collectionRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Books in Collection */}
      <div className="lg:col-span-3">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {bookRes.data.map((collectionBook) => (
            <ListBook book={collectionBook.book!} key={collectionBook.id} />
          ))}
        </div>

        {collectionRes.data.book_count === 0 && (
          <Card className="p-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No books in this collection
            </h3>
            <p className="text-muted-foreground mb-4">
              Start building your collection by adding some books.
            </p>
            <Button asChild>
              <Link
                href={`/admin/collections/${collectionRes.data.id}/manage-books`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Books
              </Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
