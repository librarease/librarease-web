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
import { TabLink } from '@/components/borrows/TabLink'
import { Badge } from '@/components/ui/badge'
import { cookies } from 'next/headers'
import { RefreshCw } from 'lucide-react'
import { getListJobs } from '@/lib/api/job'
import { revalidatePath } from 'next/cache'
import { ListCardJob } from '@/components/jobs/ListCardJob'

const statusMap = {
  pending: 'PENDING',
  processing: 'PROCESSING',
  completed: 'COMPLETED',
  failed: 'FAILED',
} as const

export const metadata: Metadata = {
  title: `Jobs · ${SITE_NAME}`,
}

export default async function Jobs({
  searchParams,
}: {
  searchParams: Promise<{
    skip?: number
    limit?: number
    status?: 'pending' | 'processing' | 'completed' | 'failed'
    type?: 'export:borrowings' | 'import:books'
  }>
}) {
  const sp = await searchParams
  const skip = Number(sp?.skip ?? 0)
  const limit = Number(sp?.limit ?? 20)
  const status = sp?.status
  const type = sp?.type

  const headers = await Verify({
    from: '/admin/jobs',
  })

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  const res = await getListJobs(
    {
      sort_by: 'created_at',
      sort_in: 'desc',
      limit: limit,
      skip: skip,
      ...(status ? { status: statusMap[status] } : {}),
      library_id: libID,
      type,
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

  const nextURL = `/admin/jobs?skip=${skip + limit}&limit=${limit}` as const
  const prevURL = `/admin/jobs?skip=${prevSkip}&limit=${limit}` as const

  async function refreshAction() {
    'use server'
    revalidatePath('/admin/jobs')
  }

  return (
    <div className="space-y-4">
      <nav className="backdrop-blur-sm sticky top-0 z-10">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>
                  Jobs
                  <Badge className="ml-4" variant="outline">
                    {res.meta.total}
                  </Badge>
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button onClick={refreshAction} variant="secondary">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </nav>
      <div className="flex flex-col gap-2 md:flex-row justify-between">
        <TabLink
          tabs={[
            { name: 'All', href: '/admin/jobs' },
            { name: 'Completed', href: '/admin/jobs?status=completed' },
            { name: 'Pending', href: '/admin/jobs?status=pending' },
            { name: 'Processing', href: '/admin/jobs?status=processing' },
            { name: 'Failed', href: '/admin/jobs?status=failed' },
          ]}
          activeHref={`/admin/jobs${status ? `?status=${status}` : ''}`}
        />

        {/* <ModelFilter filterKeys={['user_id']}>
          <UserFilter />
          <DateFilter filterKey="created_at" placeholder="Subscribed Date" />
        </ModelFilter> */}
      </div>

      <div className="grid gap-4">
        {res.data.map((job) => (
          <ListCardJob key={job.id} job={job} />
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
