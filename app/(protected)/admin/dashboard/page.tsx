import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import { SITE_NAME } from '@/lib/consts'
import type { Metadata, Route } from 'next'
import { DateRangeSelector } from '@/components/dashboard/DateRangeSelector'
import { IsLoggedIn } from '@/lib/firebase/firebase'
import { redirect, RedirectType } from 'next/navigation'
import { format, subMonths, parse, startOfDay, endOfDay } from 'date-fns'
import { getListLibraries } from '@/lib/api/library'
import { DateRange } from 'react-day-picker'
import { cookies } from 'next/headers'
import { Suspense } from 'react'
import { AnalysisChartsWrapper } from '@/components/dashboard/AnalysisChartsWrapper'
import {
  BorrowHeatmapWrapper,
  ReturnHeatmapWrapper,
} from '@/components/dashboard/HeatmapWrapper'
import { PowerUsersWrapper } from '@/components/dashboard/PowerUsersWrapper'
import {
  AnalysisChartsLoading,
  HeatmapChartLoading,
  PowerUsersLoading,
} from '@/components/dashboard/ChartLoadingComponents'

export const metadata: Metadata = {
  title: `Dashboard · ${SITE_NAME}`,
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{
    from: string
    to: string
    limit: number
    skip: number
  }>
}) {
  const claims = await IsLoggedIn()
  if (!claims) redirect('/login?from=/admin/dashboard')

  if (
    claims.librarease.role === 'USER' &&
    !claims.librarease.admin_libs.length &&
    !claims.librarease.staff_libs.length
  ) {
    redirect('/', RedirectType.replace)
  }

  const { from, to, skip, limit = 5 } = await searchParams

  const cookieStore = await cookies()
  const cookieName = process.env.LIBRARY_COOKIE_NAME as string
  const libID = cookieStore.get(cookieName)?.value

  if (!to || !from) {
    const now = new Date()
    const to = format(now, 'dd-MM-yyyy')
    const from = format(subMonths(now, 1), 'dd-MM-yyyy')
    const sp = new URLSearchParams()
    sp.set('from', from)
    sp.set('to', to)

    redirect(('?' + sp.toString()) as Route, RedirectType.replace)
  }

  const libsRes = await getListLibraries({ limit: 5 })

  if ('error' in libsRes) {
    return <div>{libsRes.error}</div>
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

    redirect(('./?' + sp.toString()) as Route, RedirectType.replace)
  }

  const start = startOfDay(parse(from, 'dd-MM-yyyy', new Date())).toJSON()
  const end = endOfDay(parse(to, 'dd-MM-yyyy', new Date())).toJSON()

  return (
    <div>
      <h1 className="text-2xl font-semibold">Libraries</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          <BreadcrumbItem>
            <BreadcrumbPage>Analysis</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid my-4 grid-cols-1 gap-4 md:grid-cols-2">
        <DateRangeSelector
          className="col-span-2"
          range={{ from: fromDate, to: toDate }}
          onChangeAction={onDateRangeChange}
        />
        <Suspense fallback={<AnalysisChartsLoading />}>
          <AnalysisChartsWrapper
            libraryId={libID!}
            from={start}
            to={end}
            limit={5}
            skip={0}
          />
        </Suspense>
        <Suspense fallback={<HeatmapChartLoading />}>
          <BorrowHeatmapWrapper libraryId={libID!} start={start} end={end} />
        </Suspense>
        <Suspense fallback={<HeatmapChartLoading />}>
          <ReturnHeatmapWrapper libraryId={libID!} start={start} end={end} />
        </Suspense>
        <Suspense fallback={<PowerUsersLoading />}>
          <PowerUsersWrapper
            libraryId={libID!}
            from={start}
            to={end}
            limit={limit}
            skip={skip}
          />
        </Suspense>
      </div>
    </div>
  )
}
