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

export default async function Dashboard() {
  const res = await getAnalysis({
    limit: 50,
    skip: 0,
    from: '2024-01-05T17:00:47.680Z',
    to: '2025-06-05T17:00:47.680Z',
    library_id: 'd7385c3e-05f7-4d0d-88c8-74fdc830ec87',
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
