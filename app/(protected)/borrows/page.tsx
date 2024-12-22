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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getListBorrows } from '@/lib/api/borrow'
import { cookies } from 'next/headers'
import Link from 'next/link'

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
          <Link href="/borrows/new">New Borrow</Link>
        </Button>
      </div>

      <Table>
        {/* <TableCaption>List of books available in the library.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Due</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Library</TableHead>
            <TableHead>Returned Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((b) => (
            <TableRow key={b.id}>
              <TableCell>{b.book.code}</TableCell>
              <TableCell>{b.borrowed_at}</TableCell>
              <TableCell>{b.subscription.user.name}</TableCell>
              <TableCell>{b.due_at}</TableCell>
              <TableCell>{b.book.title}</TableCell>
              <TableCell>{b.subscription.membership.library.name}</TableCell>
              <TableCell>
                {b.returned_at ?? <Badge variant="outline">Active</Badge>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
