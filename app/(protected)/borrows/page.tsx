import { Badge } from '@/components/ui/badge'
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { getListBorrows } from '@/lib/api/borrow'
import { Borrow } from '@/lib/types/borrow'
import { Book, Calendar, LibraryIcon, User } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'

const formatDate = (date: string): string => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  return formatter.format(new Date(date))
}

const getBorrowStatus = (borrow: Borrow) => {
  const now = new Date()
  const due = new Date(borrow.due_at)
  if (borrow.returned_at) return 'returned'
  return now > due ? 'overdue' : 'active'
}

export default async function Borrows({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    library_id?: string
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const library_id = sp?.library_id

  const cookieStore = await cookies()
  const token = cookieStore.get('auth')?.value

  const res = await getListBorrows(
    {
      sort_by: 'created_at',
      sort_in: 'desc',
      limit: limit,
      skip: skip,
      ...(library_id ? { library_id } : {}),
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if ('error' in res) {
    return <div>{JSON.stringify(res.error)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/borrows?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/borrows?skip=${prevSkip}&limit=${limit}`

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Borrows</h1>
      <div className="flex justify-between items-center">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link href="/" passHref legacyBehavior>
                <BreadcrumbLink>Home</BreadcrumbLink>
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              <BreadcrumbPage>Borrows</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Button asChild>
          <Link href="/borrows/new">
            <Book className="mr-2 h-4 w-4" />
            New Borrow
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {res.data.map((borrow) => (
          <Card key={borrow.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{borrow.book.title}</CardTitle>
                  <CardDescription>{borrow.book.code}</CardDescription>
                </div>
                <Badge
                  variant={
                    getBorrowStatus(borrow) === 'overdue'
                      ? 'destructive'
                      : getBorrowStatus(borrow) === 'returned'
                        ? 'secondary'
                        : 'default'
                  }
                  className="capitalize"
                >
                  {getBorrowStatus(borrow)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{borrow.subscription.user.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <LibraryIcon className="h-4 w-4 text-muted-foreground" />
                <span>{borrow.subscription.membership.library.name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span>Borrowed: {formatDate(borrow.borrowed_at)}</span>
                  <span
                    className={`${
                      getBorrowStatus(borrow) === 'overdue'
                        ? 'text-destructive'
                        : ''
                    }`}
                  >
                    Due: {formatDate(borrow.due_at)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                // onClick={() => alert(`Return book: ${borrow.book_id}`)}
              >
                Return Book
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={prevURL} />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={nextURL} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
