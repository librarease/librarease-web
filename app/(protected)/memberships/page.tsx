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
import { getListMemberships } from '@/lib/api/membership'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'

export const metadata: Metadata = {
  title: `Memberships · ${SITE_NAME}`,
}

export default async function Memberships({
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
  const res = await getListMemberships({
    sort_by: 'created_at',
    sort_in: 'desc',
    limit: limit,
    skip: skip,
    ...(library_id ? { library_id } : {}),
  })

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/memberships?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/memberships?skip=${prevSkip}&limit=${limit}`

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Memberships</h1>
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
                <BreadcrumbPage>Memberships</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild>
            <Link href="/memberships/new">New Membership</Link>
          </Button>
        </div>
      </nav>

      <Table>
        {/* <TableCaption>List of books available in the library.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Library</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Borrow Limit</TableHead>
            <TableHead>Borrow Period</TableHead>
            <TableHead>Active Limit</TableHead>
            <TableHead>Fine per Day</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((m) => (
            <TableRow key={m.id}>
              <TableCell>{m.name}</TableCell>
              <TableCell>{m.library.name}</TableCell>
              <TableCell>{m.duration} D</TableCell>
              <TableCell>{m.usage_limit ?? '-'}</TableCell>
              <TableCell>{m.loan_period} D</TableCell>
              <TableCell>{m.active_loan_limit}</TableCell>
              <TableCell>{m.fine_per_day ?? '-'} Pts</TableCell>
              <TableCell>{m.price ?? '-'}</TableCell>
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
