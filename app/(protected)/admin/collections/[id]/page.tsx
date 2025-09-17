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
  Book,
  Calendar,
  Edit,
  Library,
  Plus,
  Settings,
  Users,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function CollectionDetailsPage({
  params,
}: {
  params: Promise<{ id: string; title?: string }>
}) {
  const { id, title } = await params

  const [collectionRes, bookRes] = await Promise.all([
    getCollection(id),
    getListCollectionBooks(id, {
      include_book: 'true',
      book_title: title,
    }),
  ])

  if ('error' in collectionRes) {
    console.log(collectionRes)
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

      <div className="relative aspect-[2] rounded-lg mb-6">
        <Image
          src={collectionRes.data.cover?.path ?? '/book-placeholder.svg'}
          alt={collectionRes.data.title}
          fill
          className="w-full h-full object-cover rounded-t"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-4xl font-bold mb-2">
            {collectionRes.data.title}
          </h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Library className="h-4 w-4" />
              <span>{collectionRes.data.library?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{collectionRes.data.follower_count} followers</span>
            </div>
            <div className="flex items-center gap-1">
              <Book className="h-4 w-4" />
              <span>{collectionRes.data.book_count} books</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-8 flex-wrap">
        <Button variant="outline" asChild>
          <Link
            href={`/admin/collections/${collectionRes.data.id}/manage-books`}
          >
            <Settings className="mr-2 h-4 w-4" />
            Manage Books
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/admin/collections/${collectionRes.data.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <BtnDeleteCollection
          deleteCollectionAction={deleteCollectionAction.bind(
            null,
            id,
            collectionRes.data.library_id
          )}
          variant="outline"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Collection Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>About this Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {collectionRes.data.description && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {collectionRes.data.description}
                </p>
              )}

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Library className="h-4 w-4 text-muted-foreground" />
                  <span>{collectionRes.data.library?.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{collectionRes.data.follower_count} followers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Book className="h-4 w-4 text-muted-foreground" />
                  <span>{bookRes.data.length} books</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Created{' '}
                    {new Date(
                      collectionRes.data.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Books in Collection */}
        <div className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Books in Collection</h2>
            <Button asChild>
              <Link
                href={`/admin/collections/${collectionRes.data.id}/manage-books`}
              >
                <Plus className="mr-2 h-4 w-4" />
                Manage Books
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookRes.data.map((collectionBook) => (
              <Link
                href={`/admin/books/${collectionBook.book?.id}`}
                key={collectionBook.id}
              >
                <ListBook book={collectionBook.book!} />
              </Link>
            ))}
          </div>

          {collectionRes.data.book_count === 0 && (
            <Card className="p-12 text-center">
              <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
    </div>
  )
}
