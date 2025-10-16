import { format } from 'date-fns'
import { PowerUsersChart } from './RankingChart'
import { getPowerUsersAnalysis } from '@/lib/api/analysis'

type PowerUsersWrapperProps = {
  libraryId: string
  from: string
  to: string
  limit?: number
  skip?: number
  maxItems?: number
}

export async function PowerUsersWrapper({
  libraryId,
  from,
  to,
  limit = 10,
  skip = 0,
  maxItems = 10,
}: PowerUsersWrapperProps) {
  const res = await getPowerUsersAnalysis({
    skip,
    limit,
    from,
    to,
    library_id: libraryId,
  })

  if ('error' in res) {
    return (
      <div className="p-4 border border-destructive/80 rounded-lg bg-destructive/20">
        <p className="text-destructive">
          Error loading power users: {res.error}
        </p>
      </div>
    )
  }
  const descFrom = format(new Date(from), 'LLL dd, yyyy')
  const descTo = format(new Date(to), 'LLL dd, yyyy')

  const description = `${descFrom} - ${descTo}`

  return (
    <PowerUsersChart
      data={res.data}
      maxItems={maxItems}
      description={description}
    />
  )
}
