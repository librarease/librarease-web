import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { MonthlyRevenueChart } from '@/components/dashboard/MonthlyRevenueChart'
import { MostBorrowedBookChart } from '@/components/dashboard/MostBorrowedBookChart'
import { MontlyBorrowChart } from '@/components/dashboard/MontlyBorrowChart'
import { TopMembershipChart } from '@/components/dashboard/TopMembershipChart'
import { getAnalysis } from '@/lib/api/analysis'
import { SITE_NAME } from '@/lib/consts'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Dashboard · ${SITE_NAME}`,
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: Promise<{
    library_id: string
    from: string
    to: string
    limit: number
    skip: number
  }>
}) {
  const {
    library_id = 'a32af9bd-74b0-4ef2-8974-4570e2bfb4bb',
    from = '2024-01-05T17:00:47.680Z',
    to = new Date().toJSON(),
    limit = 5,
    skip,
  } = await searchParams
  const res = await getAnalysis({
    limit,
    skip,
    from,
    to,
    library_id,
  })
  console.log(res)

  if ('error' in res) {
    console.log(res)
    return <div>{JSON.stringify(res.message)}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Libraries</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link href="/" passHref legacyBehavior>
              <BreadcrumbLink>Home</BreadcrumbLink>
            </Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Analysis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid my-4 grid-cols-1 gap-4 md:grid-cols-2">
        <MontlyBorrowChart data={res.data.borrowing} />
        <MonthlyRevenueChart data={res.data.revenue} />
        <MostBorrowedBookChart data={res.data.book} />
        <TopMembershipChart data={res.data.membership} />
      </div>
    </div>
  )
}
