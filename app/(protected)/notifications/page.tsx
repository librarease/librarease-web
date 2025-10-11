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

import { Verify } from '@/lib/firebase/firebase'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { getListNotifications } from '@/lib/api/notification'
import { readAllNotificationsAction } from '@/lib/actions/notification'
import { TabLink } from '@/components/borrows/TabLink'
import { CheckCircle } from 'lucide-react'
import { Notification } from '@/components/notifications/Notification'

export const metadata: Metadata = {
  title: `Notifications · ${SITE_NAME}`,
}

export default async function Notifications({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    is_unread?: 'true'
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)

  const headers = await Verify({
    from: '/notifications',
  })

  const res = await getListNotifications(
    {
      limit: limit,
      skip: skip,
      is_unread: sp?.is_unread,
    },
    {
      headers,
    }
  )

  if ('error' in res) {
    return <div>{JSON.stringify(res.error)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/notifications?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/notifications?skip=${prevSkip}&limit=${limit}` as const

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button
            onClick={readAllNotificationsAction}
            disabled={!res.meta.unread}
            variant="outline"
          >
            <CheckCircle className="mr-2 size-4" />
            Mark all as read
          </Button>
        </div>
      </nav>
      <TabLink
        tabs={[
          { name: 'Unread', href: '/notifications?is_unread=true' },
          { name: 'All', href: '/notifications' },
        ]}
        activeHref={`/notifications${sp?.is_unread ? `?is_unread=${sp.is_unread}` : ''}`}
      />

      <div className="space-y-2">
        {res.data.map((noti) => (
          <Notification key={noti.id} noti={noti} />
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
