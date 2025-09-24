'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type RankingData = {
  user_id: string
  user_name: string
  total_books: number
}

type RankingChartProps = {
  data: RankingData[]
  title: string
  valueLabel: string
  maxItems?: number
  description: string
}

export const RankingChart: React.FC<RankingChartProps> = ({
  data,
  title,
  valueLabel,
  maxItems = 10,
  description,
}) => {
  // Sort by total_books descending and take top N
  const sortedData = [...data]
    .sort((a, b) => b.total_books - a.total_books)
    .slice(0, maxItems)
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border border-accent rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">{valueLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((item) => (
                <TableRow key={item.user_id}>
                  <TableCell className="font-mono text-center">
                    #{item.rank}
                  </TableCell>
                  <TableCell className="font-medium">
                    {item.user_name}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {item.total_books}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

// Specific implementation for Power Users
export const PowerUsersChart: React.FC<{
  data: RankingData[]
  maxItems?: number
  description: string
}> = ({ data, maxItems = 10, description }) => (
  <RankingChart
    data={data}
    title="Top Power Users"
    valueLabel="Books Borrowed"
    maxItems={maxItems}
    description={description}
  />
)
