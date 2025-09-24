import { MonthlyRevenueChart } from './MonthlyRevenueChart'
import { MostBorrowedBookChart } from './MostBorrowedBookChart'
import { MontlyBorrowChart } from './MontlyBorrowChart'
import { TopMembershipChart } from './TopMembershipChart'
import { getAnalysis } from '@/lib/api/analysis'

type AnalysisChartsWrapperProps = {
  libraryId: string
  from: string
  to: string
  limit?: number
  skip?: number
}

export async function AnalysisChartsWrapper({
  libraryId,
  from,
  to,
  limit = 5,
  skip = 0,
}: AnalysisChartsWrapperProps) {
  const res = await getAnalysis({
    skip,
    limit,
    from,
    to,
    library_id: libraryId,
  })

  if ('error' in res) {
    return (
      <>
        <div className="col-span-2 p-4 border border-destructive/80 rounded-lg bg-destructive/20">
          <p className="text-destructive/">Error loading charts: {res.error}</p>
        </div>
      </>
    )
  }

  return (
    <>
      <MostBorrowedBookChart data={res.data.book} />
      <TopMembershipChart data={res.data.membership} />
      <MontlyBorrowChart data={res.data.borrowing} />
      <MonthlyRevenueChart data={res.data.revenue} />
    </>
  )
}
