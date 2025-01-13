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
import { LibrarySelector } from '@/components/dashboard/LibrarySelector'
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import { redirect } from 'next/navigation'
import { format, subMonths, parse } from 'date-fns'
import { getListLibraries } from '@/lib/api/library'
import { DateRange } from 'react-day-picker'

export const metadata: Metadata = {
  title: `Dashboard · ${SITE_NAME}`,
}

export default async function DashboardPage({
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
  const claims = await IsLoggedIn()
  if (!claims) redirect('/login?from=/dashboard')

  const {
    library_id,
    from,
    to,
    // limit = 5,
    // skip,
  } = await searchParams

  if (claims.librarease.role != 'USER' && (!to || !from || !library_id)) {
    const now = new Date()
    const to = format(now, 'dd-MM-yyyy')
    const from = format(subMonths(now, 4), 'dd-MM-yyyy')
    const libID = claims.librarease.admin_libs.concat(
      claims.librarease.staff_libs
    )
    const sp = new URLSearchParams()
    sp.set('from', from)
    sp.set('to', to)
    sp.set('library_id', libID[0])

    redirect('?' + sp.toString())
  }

  const [res, libsRes] = await Promise.all([
    getAnalysis({
      skip: 0,
      limit: 5,
      from: parse(from, 'dd-MM-yyyy', new Date()).toJSON(),
      to: parse(to, 'dd-MM-yyyy', new Date()).toJSON(),
      library_id,
    }),
    getListLibraries({ limit: 5 }),
  ])

  if ('error' in res) {
    return <div>{res.error}</div>
  }
  if ('error' in libsRes) {
    return <div>{libsRes.error}</div>
  }

  async function onLibraryChange(libraryID: string) {
    'use server'

    const p = await searchParams
    // @ts-expect-error: skip and imit are not used now
    const sp = new URLSearchParams(p)
    sp.set('library_id', libraryID)

    redirect('/dashboard?' + sp.toString())
  }

  const fromDate = parse(from, 'dd-MM-yyyy', new Date())
  const toDate = parse(to, 'dd-MM-yyyy', new Date())

  async function onDateRangeChange(range?: DateRange) {
    'use server'

    const p = await searchParams
    // @ts-expect-error: skip and imit are not used now
    const sp = new URLSearchParams(p)
    if (!range) return
    if (range.from) sp.set('from', format(range.from, 'dd-MM-yyyy'))
    if (range.to) sp.set('to', format(range.to, 'dd-MM-yyyy'))

    redirect('/dashboard?' + sp.toString())
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
        <LibrarySelector
          libs={libsRes.data}
          lib={library_id}
          onChangeAction={onLibraryChange}
        />
        <DateRangeSelector
          range={{ from: fromDate, to: toDate }}
          onChangeAction={onDateRangeChange}
        />
        <MostBorrowedBookChart data={res.data.book} />
        <TopMembershipChart data={res.data.membership} />
        <MontlyBorrowChart data={res.data.borrowing} />
        <MonthlyRevenueChart data={res.data.revenue} />
      </div>
    </div>
  )
}
