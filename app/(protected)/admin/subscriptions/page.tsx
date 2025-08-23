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
import { getListSubs } from '@/lib/api/subscription'
import { Verify } from '@/lib/firebase/firebase'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { ListCardSubscription } from '@/components/subscriptions/ListCardSubscription'
import { TabLink } from '@/components/borrows/TabLink'
import { Badge } from '@/components/ui/badge'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: `Subscriptions · ${SITE_NAME}`,
}

export default async function Subscriptions({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    status?: 'active' | 'expired'
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const status = sp?.status

  const headers = await Verify({
    from: '/admin/subscriptions',
  })

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  const res = await getListSubs(
    {
      sort_by: 'created_at',
      sort_in: 'desc',
      limit: limit,
      skip: skip,
      status,
      library_id: libID,
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

  const nextURL =
    `/admin/subscriptions?skip=${skip + limit}&limit=${limit}` as const
  const prevURL =
    `/admin/subscriptions?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Subscriptions</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>
                  Subscriptions
                  <Badge className="ml-4" variant="outline">
                    {res.meta.total}
                  </Badge>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button asChild>
            <Link href="/admin/subscriptions/new">New Subscription</Link>
          </Button>
        </div>
      </nav>

      <TabLink
        tabs={[
          { name: 'All', href: '/admin/subscriptions' },
          { name: 'Active', href: '/admin/subscriptions?status=active' },
          { name: 'Expired', href: '/admin/subscriptions?status=expired' },
        ]}
        activeHref={`/admin/subscriptions${status ? `?status=${status}` : ''}`}
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {res.data.map((sub) => (
          <Link key={sub.id} href={`/admin/subscriptions/${sub.id}`}>
            <ListCardSubscription subscription={sub} />
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
