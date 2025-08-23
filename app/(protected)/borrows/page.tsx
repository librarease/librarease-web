import { ListCardBorrow } from '@/components/borrows/ListCardBorrow'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

import { getListBorrows } from '@/lib/api/borrow'
import { IsLoggedIn, Verify } from '@/lib/firebase/firebase'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { TabLink } from '@/components/borrows/TabLink'
import { Badge } from '@/components/ui/badge'

export const metadata: Metadata = {
  title: `Borrows · ${SITE_NAME}`,
}

export default async function Borrows({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: string
    limit?: string
    library_id?: string
    status?: string
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const library_id = sp?.library_id
  const status = sp?.status as 'active' | 'overdue' | 'returned'

  const headers = await Verify({
    from: '/borrows',
  })

  const claims = await IsLoggedIn()

  const res = await getListBorrows(
    {
      sort_by: 'created_at',
      sort_in: 'desc',
      limit: limit,
      skip: skip,
      status,
      ...(library_id ? { library_id } : {}),
      user_id: claims?.librarease?.id,
    },
    {
      headers,
    }
  )

  if ('error' in res) {
    return <div>{JSON.stringify(res.error)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  // Build next and previous URLs, preserving existing search params except skip/limit
  const nextParams = new URLSearchParams(sp)
  nextParams.set('skip', String(skip + limit))
  nextParams.set('limit', String(limit))
  const nextURL = `?${nextParams.toString()}` as const

  const prevParams = new URLSearchParams(sp)
  prevParams.set('skip', String(prevSkip))
  prevParams.set('limit', String(limit))
  const prevURL = `?${prevParams.toString()}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Borrows</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>
                  Borrows
                  <Badge className="ml-4" variant="outline">
                    {res.meta.total}
                  </Badge>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </nav>

      <TabLink
        tabs={[
          { name: 'All', href: '/borrows' },
          { name: 'Active', href: '/borrows?status=active' },
          { name: 'Overdue', href: '/borrows?status=overdue' },
          { name: 'Returned', href: '/borrows?status=returned' },
        ]}
        activeHref={`/borrows${status ? `?status=${status}` : ''}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {res.data.map((borrow, idx) => (
          <ListCardBorrow
            key={borrow.id}
            borrow={borrow}
            idx={skip + idx + 1}
          />
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
