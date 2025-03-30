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
import { getListSubs } from '@/lib/api/subscription'
import { Verify } from '@/lib/firebase/firebase'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'

export const metadata: Metadata = {
  title: `Subscriptions · ${SITE_NAME}`,
}

export default async function Subscriptions({
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

  const headers = await Verify({
    from: '/borrows',
  })

  const res = await getListSubs(
    {
      sort_by: 'created_at',
      sort_in: 'desc',
      limit: limit,
      skip: skip,
      ...(library_id ? { library_id } : {}),
    },
    {
      headers,
    }
  )

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/subscriptions?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/subscriptions?skip=${prevSkip}&limit=${limit}`

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
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
                <BreadcrumbPage>Subscriptions</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild>
            <Link href="/subscriptions/new">New Subscription</Link>
          </Button>
        </div>
      </nav>

      <Table>
        {/* <TableCaption>List of books available in the library.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Membership</TableHead>
            <TableHead>Library</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead>Active Since</TableHead>
            <TableHead>Borrow Limit</TableHead>
            <TableHead>Usage Limit</TableHead>
            <TableHead>Borrow Period</TableHead>
            <TableHead>Fine per Day</TableHead>
            <TableHead>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {res.data.map((s) => (
            <TableRow key={s.id}>
              <TableCell>
                <Link href={`subscriptions/${s.id}`} className="link">
                  {s.user?.name}
                </Link>
              </TableCell>
              <TableCell>{s.membership?.name}</TableCell>
              <TableCell>{s.membership?.library?.name}</TableCell>
              <TableCell>
                <time dateTime={s.expires_at}>{formatDate(s.expires_at)}</time>
              </TableCell>
              <TableCell>
                <time dateTime={s.created_at}>{formatDate(s.created_at)}</time>
              </TableCell>
              <TableCell>{s.active_loan_limit}</TableCell>
              <TableCell>{s.usage_limit ?? '-'}</TableCell>
              <TableCell>{s.loan_period} D</TableCell>
              <TableCell>{s.fine_per_day ?? '-'} Pts</TableCell>
              <TableCell>{s.amount ?? '-'} Pts</TableCell>
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
