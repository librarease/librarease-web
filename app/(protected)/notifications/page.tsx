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
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'
import { getListNotifications } from '@/lib/api/notification'
import { readAllNotificationsAction } from '@/lib/actions/notification'

export const metadata: Metadata = {
  title: `Notifications · ${SITE_NAME}`,
}

export default async function Notifications({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
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
    },
    {
      headers,
    }
  )

  if ('error' in res) {
    return <div>{JSON.stringify(res.error)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/notifications?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/notifications?skip=${prevSkip}&limit=${limit}`

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Notifications</h1>
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
      <ul className="space-y-2">
        {res.data.map((notification) => (
          <li key={notification.id} className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{notification.title}</h2>
                <p className="text-sm text-gray-500">{notification.message}</p>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(notification.created_at).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
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
