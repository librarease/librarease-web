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
import Image from 'next/image'
import { Calendar, Hash, Search } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import clsx from 'clsx'
import { DebouncedInput } from '@/components/common/DebouncedInput'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: `Books · ${SITE_NAME}`,
}

export default async function Books({
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

  const res = await getListBooks({
    sort_by: 'created_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    title: sp?.title,
    ...(library_id ? { library_id } : {}),
  })

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/books?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/books?skip=${prevSkip}&limit=${limit}`

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
          <Button asChild>
            <Link href="/books/new">Register New Book</Link>
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
          <Link key={book.id} href={`/books/${book.id}`} passHref>
            <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
              <CardHeader className="pb-3">
                <div className="grid place-items-center">
                  {/* 3D Book Effect */}
                  <div className="flex my-12">
                    <div className="bg-accent [transform:perspective(400px)_rotateY(314deg)] -mr-1 w-4">
                      <span className="inline-block text-nowrap text-[0.5rem] font-bold text-accent-foreground/50 [transform:rotate(90deg)_translateY(-16px)] origin-top-left">
                        {/* {book.title.length > 15
                          ? book.title.substring(0, 25) + '...'
                          : book.title} */}
                      </span>
                    </div>
                    <Image
                      src={book?.cover ?? '/book-placeholder.svg'}
                      alt={book.title + "'s cover"}
                      width={128}
                      height={192}
                      className={clsx(
                        'shadow-xl rounded-r-md w-32 h-48 object-cover',
                        '[transform:perspective(800px)_rotateY(14deg)]'
                      )}
                      priority
                    />
                  </div>
                  {/* <div className="bg-accent [transform:perspective(400px)_rotateY(314deg)] -mr-1 w-3 h-48">
                        <span className="my-2 inline-block text-nowrap text-xs font-bold text-accent-foreground/50 [transform:rotate(90deg)_translateY(-20px)] origin-top-left">
                          {book.title.length > 15
                            ? book.title.substring(0, 15) + '...'
                            : book.title}
                        </span>
                      </div>
                      <Image
                        src={
                          book.cover ??
                          '/placeholder.svg?height=192&width=128&text=No+Cover'
                        }
                        alt={`${book.title} cover`}
                        width={128}
                        height={192}
                        className="shadow-xl rounded-r-md w-32 h-48 object-cover [transform:perspective(800px)_rotateY(14deg)] group-hover:[transform:perspective(800px)_rotateY(8deg)] transition-transform duration-300"
                      /> */}
                </div>
                <CardTitle className="text-lg line-clamp-1">
                  {book.title}
                </CardTitle>
                <CardDescription className="line-clamp-1">
                  {book.author}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    <span>{book.code}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{book.year}</span>
                  </div>
                  {/* {book.genre && (
                      <Badge variant="outline" className="text-xs">
                        {book.genre}
                      </Badge>
                    )} */}
                  {/* <div className="flex justify-between items-center mt-3">
                      <Badge variant={book.available ? "default" : "destructive"}>
                        {book.available ? "Available" : "Borrowed"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{book.library}</span>
                    </div> */}
                </div>
              </CardContent>
            </Card>
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
