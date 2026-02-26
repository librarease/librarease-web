import { ListBook } from '@/components/books/ListBook'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getCollection, getListCollectionBooks } from '@/lib/api/collection'
import { Book, Calendar, Library, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FollowCollectionButton } from '@/components/collections/FollowCollectionButton'
import { Verify } from '@/lib/firebase/firebase'

export default async function CollectionDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: { title?: string }
}) {
  const { id } = await params
  const { title } = searchParams

  const headers = await Verify({ from: `/collections/${id}` })

  const [collectionRes, bookRes] = await Promise.all([
    getCollection(
      id,
      { include_stats: 'true', include_book_ids: 'true' },
      { headers }
    ),
    getListCollectionBooks(id, {
      include_book: 'true',
      book_title: title,
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
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/collections">Collections</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{collectionRes.data.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="relative aspect-[2] rounded-lg overflow-hidden mb-6">
        <Image
          src={collectionRes.data.cover || '/book-placeholder.svg'}
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
          <div className="mt-4">
            <FollowCollectionButton
              collectionId={collectionRes.data.id}
              initialIsFollowed={!!collectionRes.data.stats?.followed_at}
              className="w-auto h-9 px-4 text-sm font-medium"
            />
          </div>
        </div>
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {bookRes.data.map((collectionBook) => (
              <Link
                href={`/books/${collectionBook.book?.id}`}
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
                Follow this collection to get updates when new books are added.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
