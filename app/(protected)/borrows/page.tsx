import { ListCardBorrow } from '@/components/borrows/ListCardBorrow'
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

import { getListBorrows } from '@/lib/api/borrow'
import { Verify } from '@/lib/firebase/firebase'
import { Book } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SITE_NAME } from '@/lib/consts'

export const metadata: Metadata = {
  title: `Borrows · ${SITE_NAME}`,
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

  const headers = await Verify({
    from: '/borrows',
  })

  const res = await getListBorrows(
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
    return <div>{JSON.stringify(res.error)}</div>
  }

  const prevSkip = skip - limit > 0 ? skip - limit : 0

  const nextURL = `/borrows?skip=${skip + limit}&limit=${limit}`
  const prevURL = `/borrows?skip=${prevSkip}&limit=${limit}`

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur sticky top-0 z-10">
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
      </nav>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {res.data.map((borrow) => (
          <ListCardBorrow key={borrow.id} borrow={borrow} />
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
