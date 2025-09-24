import { BorrowHeatmapChart, ReturnHeatmapChart } from './HeatmapChart'
import {
  getBorrowingHeatmapAnalysis,
  getReturningHeatmapAnalysis,
} from '@/lib/api/analysis'

type HeatmapChartsWrapperProps = {
  libraryId: string
  start: string
  end: string
}

export async function BorrowHeatmapWrapper({
  libraryId,
  start,
  end,
}: HeatmapChartsWrapperProps) {
  const res = await getBorrowingHeatmapAnalysis({
    library_id: libraryId,
    start,
    end,
  })

  if ('error' in res) {
    return (
      <div className="p-4 border border-destructive/80 rounded-lg bg-destructive/20">
        <p className="text-destructive">
          Error loading borrow heatmap: {res.error}
        </p>
      </div>
    )
  }

  return <BorrowHeatmapChart data={res.data} />
}

export async function ReturnHeatmapWrapper({
  libraryId,
  start,
  end,
}: HeatmapChartsWrapperProps) {
  const res = await getReturningHeatmapAnalysis({
    library_id: libraryId,
    start,
    end,
  })

  if ('error' in res) {
    return (
      <div className="p-4 border border-destructive/80 rounded-lg bg-destructive/20">
        <p className="text-destructive">
          Error loading return heatmap: {res.error}
        </p>
      </div>
    )
  }

  return <ReturnHeatmapChart data={res.data} />
}
